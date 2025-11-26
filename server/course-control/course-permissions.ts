export class CoursePermissions {
  private rolePermissions = {
    student: {
      enrollCourse: true,
      viewCourseContent: true,
      trackProgress: true,
      submitAssignments: true,
      viewRecommendations: true,
      createCourse: false,
      editCourse: false,
      deleteCourse: false,
      manageCourseContent: false,
      viewAnalytics: false,
      manageEnrollments: false,
    },
    instructor: {
      enrollCourse: true,
      viewCourseContent: true,
      trackProgress: true,
      submitAssignments: true,
      viewRecommendations: true,
      createCourse: true,
      editCourse: true,
      deleteCourse: true,
      manageCourseContent: true,
      viewAnalytics: true,
      manageEnrollments: true,
    },
    admin: {
      enrollCourse: true,
      viewCourseContent: true,
      trackProgress: true,
      submitAssignments: true,
      viewRecommendations: true,
      createCourse: true,
      editCourse: true,
      deleteCourse: true,
      manageCourseContent: true,
      viewAnalytics: true,
      manageEnrollments: true,
    },
    support: {
      enrollCourse: false,
      viewCourseContent: false,
      trackProgress: true,
      submitAssignments: false,
      viewRecommendations: false,
      createCourse: false,
      editCourse: false,
      deleteCourse: false,
      manageCourseContent: false,
      viewAnalytics: true,
      manageEnrollments: false,
    },
  };

  canPerformAction(role: string, action: string): boolean {
    const permissions = this.rolePermissions[role as keyof typeof this.rolePermissions];
    if (!permissions) return false;
    return permissions[action as keyof typeof permissions] || false;
  }

  canCreateCourse(role: string): boolean {
    return this.canPerformAction(role, "createCourse");
  }

  canEditCourse(role: string): boolean {
    return this.canPerformAction(role, "editCourse");
  }

  canDeleteCourse(role: string): boolean {
    return this.canPerformAction(role, "deleteCourse");
  }

  canEnrollCourse(role: string): boolean {
    return this.canPerformAction(role, "enrollCourse");
  }

  canViewAnalytics(role: string): boolean {
    return this.canPerformAction(role, "viewAnalytics");
  }

  canManageCourseContent(role: string): boolean {
    return this.canPerformAction(role, "manageCourseContent");
  }
}

export const coursePermissions = new CoursePermissions();
