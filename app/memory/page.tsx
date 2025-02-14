"use client";

import { useMode } from "@/contexts/ModeContext";
import { Nav } from "@/components/navbar";
import { MemoryItem } from "@/components/memory/memory-item";
import { FileGrid } from "@/components/memory/file-grid";

const initialFiles = [
  { name: "Project Proposal", type: "pdf", size: "2.5 MB" },
  { name: "Team Meeting Notes", type: "docx", size: "1.2 MB" },
  { name: "Budget Spreadsheet", type: "xlsx", size: "3.7 MB" },
  { name: "Presentation Slides", type: "pptx", size: "5.1 MB" },
  { name: "Logo Design", type: "png", size: "1.8 MB" },
  { name: "Client Contract", type: "pdf", size: "3.2 MB" },
  { name: "Marketing Plan", type: "docx", size: "2.9 MB" },
  { name: "Product Roadmap", type: "xlsx", size: "4.5 MB" },
];

const memoryItems = [
  {
    timestamp: "2025-02-08 15:30",
    action: "Stored Document",
    description: "Added 'Project Proposal' to the documents folder",
  },
  {
    timestamp: "2025-02-08 14:45",
    action: "Created Task",
    description: "New task: 'Prepare presentation for team meeting'",
  },
  {
    timestamp: "2025-02-08 13:20",
    action: "Added Reference",
    description: "Added 'Machine Learning Basics' to the reference library",
  },
  {
    timestamp: "2025-02-08 11:00",
    action: "Completed Task",
    description: "Finished task: 'Review quarterly report'",
  },
  {
    timestamp: "2025-02-08 09:15",
    action: "Updated Document",
    description: "Made changes to 'Team Guidelines' document",
  },
];

export default function MemoryPage() {
  const { activeLighterColor } = useMode();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main
        className="flex-1 flex flex-col"
        style={{ backgroundColor: activeLighterColor }}
      >
        <div className="container py-8">
          <h1 className="text-4xl font-display mb-6 text-black">
            Memories with Maya
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <section className="w-full lg:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4 h-[calc(100vh-250px)] overflow-y-auto pr-4">
                {memoryItems.map((item, index) => (
                  <MemoryItem
                    key={index}
                    timestamp={item.timestamp}
                    action={item.action}
                    description={item.description}
                  />
                ))}
              </div>
            </section>

            <section className="w-full lg:w-1/2">
              <h2 className="text-2xl font-bold mb-4">Files</h2>
              <FileGrid files={initialFiles} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
