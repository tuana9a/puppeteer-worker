import { ActionLog, Context } from "puppeteer-worker-job-builder/v1";
import toPrettyErr from "./utils/toPrettyErr";

export default async function RunContext(context: Context) {
  let action = context.stacks.pop();
  let currentStepIdx = 0;
  while (action && !context.isBreak) {
    const actionName = action.getName();
    try {
      context.currentStepIdx = currentStepIdx;
      action.withContext(context); // WARN: mem leak context -> action, action -> context
      action.setStepIdx(currentStepIdx);
      action.setNestingLevel(context.currentNestingLevel);

      context._onDoing({
        job: context.jobName,
        action: actionName,
        stacks: context.stacks.map((x) => x.getName()),
        at: Date.now(),
      });

      // trust action do whatever it does =))
      await action.run();

      action = context.stacks.pop();
      currentStepIdx += 1;
    } catch (error) {
      context.logs.push(new ActionLog({ action: actionName, error: toPrettyErr(error) }));
      context.isBreak = true;
    }
  }
  const { logs } = context;
  context.destroy();
  return logs;
}
