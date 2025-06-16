## Full-Stack Todo Application

### Getting Started
Follow these steps to get the application up and running on your local machine.

1. **Clone the Repository**
```bash
   git clone https://github.com/SergeyPoly/DigitalSuits-FS-test-task.git
   cd DigitalSuits-FS-test-task
```
2. **Backend Setup**\
   Navigate to the backend directory:
   ```bash
   cd backend
   ```
   ###### Database Configuration
   1. Create Databases:
       * Create a PostgreSQL database for development (e.g., todo_db).
       * Create a separate PostgreSQL database for testing (e.g., todo_test_db).
   2. Environment Variables:
       * Create a .env file in the backend/ directory (next to package.json).
       * Copy the contents from .env.example into your new .env file and replace placeholders with your PostgreSQL credentials.
   3. Sequelize CLI Configuration:
       * Ensure ormconfig.json is correctly configured for your development and test databases. It should use the database names (todo_db, todo_test_db) and credentials you've set up.

   ###### Install Dependencies
   ```bash
   npm install
   ```
   ###### Run Database Migrations
   ```bash
   npm run db:migrate
   ```
   ###### Start the Backend Server
   ```bash
   npm run dev
   ```
   The backend API will be available at http://localhost:5000/api/todos.


3. **Frontend Setup**\
   Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
   ###### Environment Variables
   1. Create .env.local:
      * Create a .env.local file in the frontend/ directory (next to package.json).
      * Copy the content from .env.local.example into your new .env.local file.

      Ensure NEXT_PUBLIC_API_BASE_URL matches the address of your running backend.

   ###### Install Dependencies
   ```bash
   npm install
   ```
   ###### Start the Frontend Application
   ```bash
   npm run dev
   ```

   The frontend application will be available at http://localhost:3000.

### Running Tests
Ensure you are in the backend/ directory.
```bash
npm test
```
Note: Integration tests will automatically manage (drop and recreate) the todo_test_db for a clean state before running. Ensure your todo_test_db is configured in ormconfig.json.
