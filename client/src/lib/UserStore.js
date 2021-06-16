class UserStore {
  static setClassId(classId) {
    localStorage.setItem('classId', classId);
  }

  static getClassId() {
    return localStorage.getItem('classId');
  }

  static clearClassId() {
    localStorage.removeItem('classId');
  }

  static setClassName(className) {
    localStorage.setItem('className', className);
  }

  static getClassName() {
    return localStorage.getItem('className');
  }

  static clearClassName() {
    localStorage.removeItem('className');
  }
}

export default UserStore;