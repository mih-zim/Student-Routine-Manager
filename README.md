# Student Routine Manager

A lightweight, user-friendly desktop application built with **ElectronJS** for managing student class routines, organizing weekly schedules, and detecting timetable conflicts.

[ElectronJS](https://www.electronjs.org/) · [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) · [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) · [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Features

- **Class Routine Management:** Add class information, including subject name, teacher, classroom, day, and class time.
- **Weekly Schedule:** View the complete class routine organized by days of the week.
- **Edit & Delete:** Update or remove existing class schedule entries.
- **Time Conflict Detection:** Detect overlapping class schedules to help prevent timetable conflicts.
- **Search Functionality:** Search for classes by subject or teacher.
- **Day Filtering:** Filter the routine to display classes for a selected day.
- **Local Data Storage:** Automatically save routine information using browser LocalStorage.
- **Print Routine:** Print the weekly class schedule for offline use.
- **Desktop Application:** Run the application as a desktop program using ElectronJS.

---

## Installation & Usage

### Run Locally (Development)

1. Clone or download the project:

   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd StudentRoutineManagementSystem
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

The Student Routine Management System will open in a desktop window.

### Build the Application

The project includes a build script configured in `package.json`.

Run:

```bash
npm run build
```

The available build output depends on the project's Electron Builder configuration.

---

## Project Architecture

The application is developed using ElectronJS and web technologies.

- **`main.js`** — Electron Main Process responsible for creating and managing the application window.
- **`index.html`** — Defines the structure and layout of the user interface.
- **`style.css`** — Contains the design, colors, layout, and styling of the application.
- **`script.js`** — Handles routine management, adding and editing classes, searching, filtering, conflict detection, and LocalStorage operations.
- **`package.json`** — Contains project information, dependencies, and application scripts.

---

## Technologies Used

| Technology | Purpose |
| --- | --- |
| ElectronJS | Building the desktop application |
| HTML5 | Creating the user interface structure |
| CSS3 | Designing and styling the interface |
| JavaScript | Implementing application functionality |
| Node.js | Supporting the Electron runtime |
| LocalStorage | Saving routine data locally |

---

## How It Works

The application allows users to enter their class information through a simple form. The entered information is displayed in the weekly routine.

When a new class is added, the system checks whether its scheduled time overlaps with another class on the same day. If a conflict is detected, the application informs the user.

Routine information is saved in LocalStorage, allowing it to remain available after the application is closed and reopened on the same computer.

---

## Project Objective

The main objective of this project is to simplify the process of creating and managing student class routines through a desktop application.

It reduces manual timetable management, helps identify scheduling conflicts, and provides an organized way to view and maintain weekly class schedules.

---
