import { ActionLog, Context, toPrettyErr } from "puppeteer-worker-job-builder/v1";

export default async function RunContext(context: Context) {
  let action = context.stacks.pop();
  while (action && !context.isBreak) {
    const actionName = action.getName();
    try {
      action.withContext(context); // WARN: mem leak context -> action, action -> context
      action.setStepIdx(context.currentStepIdx);
      action.setNestingLevel(context.currentNestingLevel);

      context.doing({
        job: context.job,
        action: actionName,
        stepIdx: action.stepIdx,
        nestingLevel: action.nestingLevel,
        stacks: Array.from(context.stacks).map((x) => x.getName()).reverse(),
        at: Date.now(),
      });

      // trust action do whatever it does =))
      await action.run();

      action = context.stacks.pop();
      context.currentStepIdx += 1;
    } catch (error) {
      context.logs.push(new ActionLog().fromAction(action).withError(toPrettyErr(error)));
      context.isBreak = true;
    }
  }
  const { logs } = context;
  context.destroy();
  return logs;
}
