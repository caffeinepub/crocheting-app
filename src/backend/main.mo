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

  type Tutorial = {
    title : Text;
    description : Text;
    difficulty : Text;
    steps : [Text];
    materials : [Text];
  };

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
  var tutorials = Map.empty<Text, Tutorial>();
  let projects = Map.empty<Principal, List.List<Project>>();

  // Add five beginner crochet tutorials
  public shared ({ caller }) func initializeDefaultTutorials() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only admin can initialize tutorials");
    };
    var newTutorials = Map.empty<Text, Tutorial>();
    newTutorials.add(
      "Granny Square",
      {
        title = "Granny Square";
        description = "A classic square motif using basic stitches.";
        difficulty = "Beginner";
        steps = [
          "Start with a magic ring.",
          "Chain 3 (counts as first double crochet).",
          "Make 2 double crochets into the ring.",
          "Chain 2 to create a corner.",
          "Repeat steps 2-4 three times.",
          "Slip stitch to join and fasten off."
        ];
        materials = [
          "Worsted weight yarn",
          "5mm crochet hook",
          "Scissors",
          "Yarn needle"
        ];
      }
    );
    newTutorials.add(
      "Chain Stitch",
      {
        title = "Chain Stitch";
        description = "The most basic crochet stitch, used as a foundation.";
        difficulty = "Beginner";
        steps = [
          "Make a slip knot.",
          "Hold the yarn and hook.",
          "Yarn over the hook.",
          "Pull yarn through the loop on the hook.",
          "Repeat for desired length."
        ];
        materials = [
          "Any weight yarn",
          "Appropriate crochet hook"
        ];
      }
    );
    newTutorials.add(
      "Single Crochet",
      {
        title = "Single Crochet";
        description = "A dense, sturdy stitch for various projects.";
        difficulty = "Beginner";
        steps = [
          "Make a foundation chain.",
          "Insert hook into second chain from hook.",
          "Yarn over and pull through chain.",
          "Yarn over again and pull through both loops on hook.",
          "Repeat across the row."
        ];
        materials = [
          "Any weight yarn",
          "Appropriate crochet hook"
        ];
      }
    );
    newTutorials.add(
      "Double Crochet",
      {
        title = "Double Crochet";
        description = "A taller, more open stitch than single crochet.";
        difficulty = "Beginner";
        steps = [
          "Make a foundation chain.",
          "Yarn over and insert hook into fourth chain from hook.",
          "Yarn over and pull through chain.",
          "Yarn over and pull through first two loops.",
          "Yarn over and pull through remaining two loops.",
          "Repeat across the row."
        ];
        materials = [
          "Any weight yarn",
          "Appropriate crochet hook"
        ];
      }
    );
    newTutorials.add(
      "Magic Ring",
      {
        title = "Magic Ring";
        description = "A technique to start projects in the round.";
        difficulty = "Beginner";
        steps = [
          "Form a loop with the yarn.",
          "Insert hook into the loop.",
          "Yarn over and pull through loop.",
          "Chain 1 to secure.",
          "Begin working stitches into the ring.",
          "Pull tail to tighten center."
        ];
        materials = [
          "Any weight yarn",
          "Appropriate crochet hook"
        ];
      }
    );
    tutorials := newTutorials;
  };

  public query ({ caller }) func getAllTutorials() : async [Tutorial] {
    Array.fromIter(tutorials.values());
  };

  public query ({ caller }) func getTutorial(title : Text) : async ?Tutorial {
    tutorials.get(title);
  };

  public shared ({ caller }) func createTutorial(title : Text, description : Text, difficulty : Text, steps : [Text], materials : [Text]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create tutorials");
    };
    let newTutorial : Tutorial = {
      title;
      description;
      difficulty;
      steps;
      materials;
    };
    tutorials.add(title, newTutorial);
  };

  public shared ({ caller }) func updateTutorial(title : Text, description : Text, difficulty : Text, steps : [Text], materials : [Text]) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update tutorials");
    };
    switch (tutorials.get(title)) {
      case (null) { Runtime.trap("Tutorial not found") };
      case (?existingTutorial) {
        let updatedTutorial : Tutorial = {
          title = existingTutorial.title;
          description;
          difficulty;
          steps;
          materials;
        };
        tutorials.add(title, updatedTutorial);
      };
    };
  };

  public shared ({ caller }) func deleteTutorial(title : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete tutorials");
    };
    switch (tutorials.get(title)) {
      case (null) { Runtime.trap("Tutorial not found") };
      case (?_) {
        tutorials.remove(title);
      };
    };
  };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view all projects");
    };

    let allProjects = List.empty<Project>();

    for ((_, projectList) in projects.entries()) {
      allProjects.addAll(projectList.values());
    };

    allProjects.toArray().sort();
  };

  public query ({ caller }) func getProjects(userId : Principal) : async [Project] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view project materials");
    };

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
