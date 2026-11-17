---
page_id: physical_ai
layout: project
title: Voice- and Text-Controlled Quadruped Robot for Inspection
description: Developing a system in which a quadruped robot moves to designated points on voice or text commands and takes inspection photos.
importance: 3
img: assets/img/projects/physical_ai_pipeline.svg
context: Industry collaboration with Hyundai Rotem
period: Aug 2026 – ongoing
highlight: "8/8 arrivals in saved-map waypoint navigation · Localization initialization error 1 cm · 0.3°"
tags: [ROS 2, SLAM, Nav2, LiDAR, Python]
teaser: /assets/img/projects/physical_ai_pipeline.svg
teaser_caption: "Overall architecture. A worker's voice or text command passes stop-word spotting and intent interpretation before reaching the bridge; the robot localizes on the saved map, moves to the designated waypoint, and takes a photo. The blue area is the SLAM and navigation part I was responsible for."
overview:
  - label: Problem
    value: "Develop a system in which a quadruped robot moves to designated points in hard-to-reach spaces and takes inspection photos. It assumes no network connectivity; workers give voice or text commands from a mobile app."
  - label: Work
    value: "Implemented the waypoint navigation pipeline directly on ROS 2 Foxy: SLAM-based mapping, localization, waypoint registration, autonomous navigation, and arrival handling."
  - label: Outcome
    value: "In an indoor test space, **all 8 waypoint runs arrived**, with start-pose initialization error of **1 cm · 0.3°** (target 10 cm · 5°). Work is ongoing on vision-based framing correction and photo quality checks."
glance:
  - label: Period
    value: Aug 2026 – ongoing
  - label: Team
    value: ANDLab, Yonsei University · SLAM and autonomous navigation; main client contact
  - label: Stack
    value: Unitree Go2 EDU (Jetson Orin NX), Hesai XT16 LiDAR, ROS 2 Foxy, Nav2, AMCL, Python
---

## Background

Hyundai Rotem is exploring quadruped robots to take inspection photos in areas of railway vehicle maintenance that are hard for people to reach. A worker gives a command such as "go to point A and take a photo" from a mobile app, and the robot moves there, takes the photo, and returns the result.

- **Constraints.** No network connectivity. On-site data and site visits were not available for security reasons, so development is based on an indoor test space in the lab.
- **Priority.** First complete the full flow (voice or text command → movement → photo → result check) within six months, then refine shooting position and framing.

## My role

<div class="project-role" markdown="1">
- SLAM and autonomous navigation: mapping, localization, waypoint registration, waypoint navigation, and arrival handling
- Measured the Go2's motion characteristics, compensated velocity commands, and resolved navigation issues found in robot tests
- Main client contact for the lab (scope questions, meeting materials, and minutes)
</div>

## Approach

1. **Mapping.** Built a map of the test space with an added XT16 LiDAR and set a reference position as the origin.
2. **Localization and waypoint registration.** Estimated the robot pose with AMCL and saved photo points to the map with IDs and names.
3. **Waypoint navigation.** Planned paths with Nav2; motion commands reach the robot only through the bridge.
4. **Arrival handling.** If heading error exceeds 3°, the robot corrects it with short turns (up to 4) and adjusts posture, and takes a photo only once arrival is confirmed.
5. **Verification.** Combined automated tests of each stage without the robot and runs on the real robot.

## Results

<div class="paper-stats">
  <div class="paper-stat">
    <span class="paper-stat-value">1 cm · 0.3°</span>
    <span class="paper-stat-label">Start-pose initialization error (target 10 cm · 5°)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">8 / 8</span>
    <span class="paper-stat-label">Arrivals at saved waypoints (5 waypoints registered)</span>
  </div>
  <div class="paper-stat">
    <span class="paper-stat-value">176</span>
    <span class="paper-stat-label">Automated tests passed</span>
  </div>
</div>

<figure class="paper-figure paper-figure-wide">
  <img src="/assets/img/projects/physical_ai_drive.jpg" alt="Actual trajectory on the SLAM map and the robot's front camera view" loading="lazy">
  <figcaption>Waypoint navigation in the indoor test space. The actual trajectory (green) and registered waypoints (blue) are shown on the SLAM map built for the project; the right panel is the robot's front camera.</figcaption>
</figure>

The full waypoint flow, from start-pose initialization through waypoint registration, autonomous navigation, and automatic photo capture on arrival, was confirmed on the real robot. At the team level, emergency-stop keyword spotting ("정지" and "그만", 3.4% false alarm rate), a small command-interpretation model (HyperCLOVAX 0.5B, 351 MiB), and text-command navigation and capture were also implemented, reaching the stage where a text command in the app drives the robot to a waypoint and takes a photo.

## Troubleshooting

<div class="project-issue" markdown="1">
#### 1. No SLAM packages on the robot computer

**Problem.** The robot computer (Jetson) had no SLAM or scan-conversion packages, and the XT16 vendor SLAM could not be used because of a license check.

**Cause.** The robot runs ROS 2 Foxy, so recent open-source packages could not be installed as is.

**Fix.** Implemented the required functions as Python nodes for Foxy, referencing recent open-source implementations.

**Result.** The full waypoint flow, from mapping to arrival handling, runs on the robot.

</div>

<div class="project-issue" markdown="1">
#### 2. Circling near the goal and stopping early

**Problem.** The robot circled near the goal for about 25 seconds, and stopped 1.4 m short of the goal.

**Cause.** Nav2's heading alignment did not suit the Go2's turning behavior, and including live scans in global planning let a single reflection block the path.

**Fix.** Moved heading alignment from Nav2 to the bridge, removed live scans from global planning, and disabled automatic recovery behaviors.

**Result.** All 8 waypoint runs arrived.

</div>

<div class="project-issue" markdown="1">
#### 3. Slow commands not executed

**Problem.** A 0.2 m/s command produced only about 0.06 m/s of actual motion, and slow rotation commands were not executed properly.

**Cause.** The Go2's actual motion drops sharply below a certain command speed.

**Fix.** Based on measurements, raised 0.05–0.25 m/s commands to 0.25 m/s and rotations below 0.6 rad/s to 0.6 rad/s, and capped speed at 0.4 m/s and 0.8 rad/s.

**Result.** Waypoint navigation runs without stalls or delays at low speed.

</div>

<div class="project-issue" markdown="1">
#### 4. CPU overload from LiDAR processing

**Problem.** The LiDAR processing node reached 480% CPU.

**Cause.** No limit on processing threads, so it monopolized Jetson resources.

**Fix.** Limited the number of processing threads.

</div>

## Current work and next steps

- Quantitative checks such as repeat arrival accuracy (target 10 cm · 3°) and stop time per stop method are in progress.
- At the client's request, work is under way on marker-free (no AprilTag) vision-based framing correction, photo-quality checks, and robustness to environmental change.
- All tests used an indoor test space; deployment requires re-validation under real site conditions.
