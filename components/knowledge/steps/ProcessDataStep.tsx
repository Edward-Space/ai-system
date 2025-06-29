"use client";

import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Database } from "lucide-react";

interface ProcessDataStepProps {
  onPrev: () => void;
}

export const ProcessDataStep = ({ onPrev }: ProcessDataStepProps) => {
  const handleFinish = () => {
    // TODO: Implement final processing logic
    console.log("Processing knowledge data...");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Process Data</h2>
        <p className="text-muted-foreground">
          Finalize and process your knowledge base
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Database className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-medium">Data Processing</h3>
            <p className="text-muted-foreground">
              This step will be implemented later. You can process and finalize your knowledge base here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous: Segmented Preview
        </Button>
        <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
          Finish & Create Knowledge
        </Button>
      </div>
    </div>
  );
};