import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { 
  FileText, 
  File, 
  FileImage, 
  Video, 
  FilePlus, 
  Search,
  Download,
  ExternalLink,
  Folder
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Course } from "@shared/schema";

// Define resource types
type ResourceType = "document" | "image" | "video" | "link";

interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  courseId: number;
  courseName: string;
  size?: string;
  dateAdded: Date;
  url: string;
}

// Mock resources data for demonstration
const dummyResources: Resource[] = [
  {
    id: "res1",
    name: "Introduction to JavaScript.pdf",
    type: "document",
    courseId: 1,
    courseName: "Introduction to JavaScript",
    size: "2.4 MB",
    dateAdded: new Date(2025, 2, 15),
    url: "#"
  },
  {
    id: "res2",
    name: "Data Science Cheat Sheet.pdf",
    type: "document",
    courseId: 2,
    courseName: "Data Science Fundamentals",
    size: "1.8 MB",
    dateAdded: new Date(2025, 3, 5),
    url: "#"
  },
  {
    id: "res3",
    name: "System Architecture Diagram.png",
    type: "image",
    courseId: 3,
    courseName: "System Design",
    size: "780 KB",
    dateAdded: new Date(2025, 3, 10),
    url: "#"
  },
  {
    id: "res4",
    name: "Machine Learning Tutorial",
    type: "video",
    courseId: 4,
    courseName: "Machine Learning Basics",
    size: "45 MB",
    dateAdded: new Date(2025, 3, 12),
    url: "#"
  },
  {
    id: "res5",
    name: "Additional Reading: WCAG Guidelines",
    type: "link",
    courseId: 5,
    courseName: "Web Accessibility",
    dateAdded: new Date(2025, 3, 18),
    url: "https://www.w3.org/WAI/standards-guidelines/wcag/"
  }
];

// Helper function to get icon based on resource type
function getResourceIcon(type: ResourceType) {
  switch (type) {
    case "document":
      return <FileText className="h-6 w-6 text-blue-500" />;
    case "image":
      return <FileImage className="h-6 w-6 text-green-500" />;
    case "video":
      return <Video className="h-6 w-6 text-red-500" />;
    case "link":
      return <ExternalLink className="h-6 w-6 text-purple-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  
  // Fetch enrolled courses for filtering
  const { data: userCourses = [] } = useQuery<(Course & { id: number })[]>({
    queryKey: ["/api/user/courses"],
  });
  
  // Fetch all courses to link resources with course names
  const { data: allCourses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });
  
  // Filter resources based on search query
  const filteredResources = dummyResources.filter(resource => 
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group resources by course
  const resourcesByourse = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.courseId]) {
      acc[resource.courseId] = {
        courseName: resource.courseName,
        resources: []
      };
    }
    acc[resource.courseId].resources.push(resource);
    return acc;
  }, {} as Record<number, {courseName: string, resources: Resource[]}> );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          
          {(user?.role === "instructor" || user?.role === "admin") && (
            <Button className="gap-2">
              <FilePlus className="h-4 w-4" />
              Upload Resource
            </Button>
          )}
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Folder className="h-4 w-4 mr-2" />
                  Filter by Course
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {allCourses.map(course => (
                  <DropdownMenuItem key={course.id}>
                    {course.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <TabsContent value="all">
            {Object.entries(resourcesByourse).map(([courseId, { courseName, resources }]) => (
              <div key={courseId} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{courseName}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources
                .filter(resource => resource.type === "document")
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="media">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources
                .filter(resource => resource.type === "image" || resource.type === "video")
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="links">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources
                .filter(resource => resource.type === "link")
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Resource card component
function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-primary/10 p-2 rounded-full">
          {getResourceIcon(resource.type)}
        </div>
        <div>
          <CardTitle className="text-base">{resource.name}</CardTitle>
          <CardDescription>{resource.courseName}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          {resource.size && <p>Size: {resource.size}</p>}
          <p>Added: {resource.dateAdded.toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter>
        {resource.type === "link" ? (
          <Button variant="outline" className="w-full gap-2" asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open Link
            </a>
          </Button>
        ) : (
          <Button variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}