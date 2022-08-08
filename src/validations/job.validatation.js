class JobValidation {
  isValidTasks(tasks) {
    if (!tasks) {
      return false;
    }
    if (!Array.isArray(tasks)) {
      return false;
    }
    if (tasks.length === 0) {
      return false;
    }
    if (!tasks.every((task) => this.isValidTask(task))) {
      return false;
    }
    return true;
  }

  isValidTask(task) {
    if (!task) {
      return false;
    }
    if (!task.run) {
      return false;
    }
    return true;
  }
}

module.exports = JobValidation;
