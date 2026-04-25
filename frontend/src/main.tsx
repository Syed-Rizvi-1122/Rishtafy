
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://baqejttdjmkqaolbsrsi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhcWVqdHRkam1rcWFvbGJzcnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjcxODAsImV4cCI6MjA5MjQ0MzE4MH0.5SC0aE_DutAndIy9SDiO3KTD0hyhR-mGi9ggKMXsddk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

createRoot(document.getElementById("root")!).render(<App />);
  