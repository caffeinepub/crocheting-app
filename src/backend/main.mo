import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Order "mo:core/Order";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Principal "mo:core/Principal";

actor {
  // Initialize authentication system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
    bio : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  module CrochetProject {
    public type Project = {
      creator : Principal;
      title : Text;
      description : Text;
      instructions : Text;
      images : [Storage.ExternalBlob];
      completion_percentage : Nat;
      time_spent_minutes : Nat;
      materials : [Material];
    };

    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Text.compare(project1.title, project2.title);
    };
  };

  type Project = CrochetProject.Project;

  type Material = {
    name : Text;
    quantity : Nat;
    unit : Text;
  };

  type CrochetPattern = {
    name : Text;
    pattern_steps : [Text];
    materials_needed : [Material];
  };

  let patterns = Map.empty<Text, CrochetPattern>();

  let projects = Map.empty<Principal, List.List<Project>>();

  public shared ({ caller }) func addPattern(name : Text, steps : [Text], materials : [Material]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add patterns");
    };
    let pattern : CrochetPattern = {
      name;
      pattern_steps = steps;
      materials_needed = materials;
    };
    patterns.add(name, pattern);
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    let allProjects = List.empty<Project>();

    for ((_, projectList) in projects.entries()) {
      allProjects.addAll(projectList.values());
    };

    allProjects.toArray().sort();
  };

  public query ({ caller }) func getProjects(userId : Principal) : async [Project] {
    switch (projects.get(userId)) {
      case (null) { [] };
      case (?projectList) { projectList.toArray().sort() };
    };
  };

  public shared ({ caller }) func addProject(title : Text, description : Text, instructions : Text, images : [Storage.ExternalBlob], materials : [Material]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add projects");
    };

    let project : Project = {
      creator = caller;
      title;
      description;
      instructions;
      images;
      completion_percentage = 0;
      time_spent_minutes = 0;
      materials;
    };

    let userProjects = switch (projects.get(caller)) {
      case (null) { List.empty<Project>() };
      case (?existingProjects) { existingProjects };
    };

    userProjects.add(project);
    projects.add(caller, userProjects);
  };

  public shared ({ caller }) func updateProject(title : Text, images : [Storage.ExternalBlob], completion_percentage : Nat, time_spent_minutes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };

    switch (projects.get(caller)) {
      case (null) { Runtime.trap("Project not found") };
      case (?userProjects) {
        let updatedProjects = userProjects.map<Project, Project>(
          func(project) {
            if (project.title == title and project.creator == caller) {
              return {
                creator = caller;
                title;
                description = project.description;
                instructions = project.instructions;
                images = images;
                completion_percentage;
                time_spent_minutes;
                materials = project.materials;
              };
            };
            project;
          }
        );
        projects.add(caller, updatedProjects);
      };
    };
  };

  public query ({ caller }) func getProjectMaterials(title : Text) : async [Material] {
    for ((_, projectList) in projects.entries()) {
      for (project in projectList.values()) {
        if (project.title == title) {
          return project.materials;
        };
      };
    };
    Runtime.trap("Project not found");
  };

  public query ({ caller }) func getPatterns() : async [CrochetPattern] {
    Array.fromIter(patterns.values());
  };

  public query ({ caller }) func getPattern(name : Text) : async ?CrochetPattern {
    patterns.get(name);
  };
};
