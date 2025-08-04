import LocalFilePreviewDemo from "@/components/knowledge/steps/LocalFilePreviewDemo";

export default function LocalFilePreviewDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Local File Preview Demo</h1>
          <p className="text-muted-foreground">
            Test tính năng preview file local với iframe và các component preview
          </p>
        </div>
        <LocalFilePreviewDemo />
      </div>
    </div>
  );
}