import "dotenv/config";
import app from "./app.js";
import { registerJobs } from "./jobs/index";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  registerJobs();
});
