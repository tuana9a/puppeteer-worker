import { ActionLog, Context, toPrettyErr } from "puppeteer-worker-job-builder";

export default async function runContext(context: Context) {
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

      // trust action do whatever it does
      // even recursively call runContext again
      // or destroy context
      await action.run();

      action = context.stacks.pop();
      context.currentStepIdx += 1;
    } catch (error) {
      context.logs.push(new ActionLog().fromAction(action).withError(toPrettyErr(error)));
      context.isBreak = true;
    }
  }

  // destroy after return logs or will lost logs
  setTimeout(() => context.destroy(), 1000);
  return context.logs;
}
