# TaskFlow — A Smart Task Manager with Priority Scoring

TaskFlow is a premium, high-fidelity MERN stack task management application. The backend automatically calculates a dynamic **Priority Score** for each task based on its importance level and proximity to the due date. The frontend is a sleek, glassmorphic React dashboard featuring real-time analytical metrics derived directly from MongoDB database aggregations.

---

## 🚀 Key Features

- **Automated Priority Scoring**: Dynamically calculates scores using the formula:
  $$\text{priorityScore} = (\text{importance} \times 10) + \frac{100}{\max(\text{daysUntilDue}, 1)}$$
  *Note: Scores are calculated in-memory at read-time and drop to exactly `0` for completed tasks.*
- **Real-Time Analytics Dashboard**: Real-time stats computed via a high-performance **MongoDB Aggregation Pipeline (`$facet` aggregation)** to extract counts, averages, and status metrics.
- **Combined API Filters**: API query filtering support for task status and minimum importance levels (`?status=pending&minImportance=3`).
- **Premium Glassmorphic Design**: Built using modern CSS (with HSL custom color tokens, `backdrop-filter` blurs, smooth micro-interactions, responsive grids, and priority card highlight animations).
- **Production Ready Error Handling**: Robust Express error handling middleware parsing validation errors, data casts, and 404s into standardized JSON payloads.

---

## 🛠️ Technology Stack

1. **Frontend**: React (Vite SPA), Axios, Lucide React, Premium HSL Vanilla CSS.
2. **Backend**: Node.js, Express.js, Mongoose.
3. **Database**: MongoDB Atlas.
4. **Testing**: Postman Collection.

---

## 📁 Repository Structure

```
/
├── backend/
│   ├── config/db.js          # Mongoose database client setup
│   ├── models/Task.js        # Task schema + virtual priority scoring
│   ├── routes/taskRoutes.js  # CRUD routes + MongoDB aggregation analytics
│   ├── server.js             # Express application & error handling middleware
│   └── .env.example          # Sample environment configurations
├── frontend/
│   ├── src/
│   │   ├── components/       # StatsDashboard, TaskForm, TaskFilters, TaskCard
│   │   ├── utils/api.js      # Axios client configuration
│   │   ├── App.jsx           # State coordinator & layout container
│   │   ├── index.css         # Custom dark-theme glassmorphism styling
│   │   └── main.jsx          # DOM rendering entry point
│   └── package.json
├── TaskFlow_Postman_Collection.json  # Import directly into Postman for instant API testing
└── README.md
```

---

## 💻 Local Setup & Execution

### 1. Prerequisite
- Ensure you have [Node.js](https://nodejs.org/) installed.
- Ensure you have a local MongoDB running or access to a MongoDB Atlas cluster.

### 2. Run Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the sample environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Adjust `MONGODB_URI` in `.env` to point to your MongoDB Atlas connection string (or use the preconfigured local MongoDB URL fallback `mongodb://127.0.0.1:27017/taskflow`).
5. Launch the backend in development hot-reload mode:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000.*

### 3. Run Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the React app locally:
   ```bash
   npm run dev
   ```
   *The client will launch on http://localhost:5173. Double check that the backend is running to allow data loading.*

---

## 🧪 API Specifications & Postman Testing

We have created a full **[TaskFlow_Postman_Collection.json](file:///c:/Users/Krish/OneDrive/Desktop/New%20folder%20(2)/TaskFlow_Postman_Collection.json)** file in the root folder. 

### To use it:
1. Open Postman.
2. Click **Import** -> Select **TaskFlow_Postman_Collection.json** -> Import.
3. Use the collection environment variables to quickly set your `baseUrl` (defaults to `http://localhost:5000`) and test CRUD routes instantly.

### Endpoints Covered:
- **POST `/bfhl/tasks`**: Creates a new task. Performs validation checks (e.g. `dueDate` must be a future date on creation, `importance` must be 1-5, `title` length must be 3-100 characters). Returns `201 Created` with calculated `priorityScore`.
- **GET `/bfhl/tasks`**: Returns all tasks matching your active filters (e.g. `?status=pending&minImportance=3`), automatically sorted in-memory by `priorityScore` in descending order.
- **PATCH `/bfhl/tasks/:id`**: Performs partial updates. Validates input bounds. Updates status and scores.
- **GET `/bfhl/tasks/stats`**: Leverages the MongoDB aggregation pipeline to compute the analytical stats:
  ```json
  {
    "totalTasks": 12,
    "pendingTasks": 8,
    "completedTasks": 4,
    "averageImportance": 3.25,
    "overdueTasks": 2,
    "tasksByImportance": {
      "1": 1, "2": 2, "3": 3, "4": 4, "5": 2
    }
  }
  ```
- **DELETE `/bfhl/tasks/:id`**: Removes task and returns success feedback.

---

## ☁️ Live Deployments

The application is deployed live and configured to interact directly with your MongoDB Atlas database:
- **GitHub Repository**: [https://github.com/Frostt-Dev/TaskFlow](https://github.com/Frostt-Dev/TaskFlow)
- **Live Frontend (Netlify)**: [https://taskflow-krish-mern.netlify.app](https://taskflow-krish-mern.netlify.app)
- **Live Backend API (Render)**: [https://taskflow-xblx.onrender.com](https://taskflow-xblx.onrender.com)

---

## ☁️ Deployment Reference

### 1. Database (MongoDB Atlas)
1. Sign in to your [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas).
2. Create a Free-Tier Shared Cluster (or reuse an existing one by appending a database name, e.g. `/deskflow` to your connection string).
3. Under **Network Access**, whitelist `0.0.0.0/0` so public servers can connect.

### 2. Backend (Render)
Our Express backend is hosted on Render via their automated blueprint system using the connected GitHub repo:
- **Build Settings**: Root: `backend`, Build: `npm install`, Start: `npm start`.
- **Environment Variables**:
  - `MONGODB_URI` = `mongodb+srv://Krish:Shadow2020@cluster0.upksuo3.mongodb.net/deskflow?retryWrites=true&w=majority`
  - `PORT` = `5000`

### 3. Frontend (Netlify)
Our React application is hosted on Netlify and connected directly to the active Render instance:
- **Build Settings**: Root: `frontend`, Build: `npm run build`, Publish: `dist`.
- **Environment Variables**:
  - `VITE_API_URL` = `https://taskflow-xblx.onrender.com`
