"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Upload, Settings, Eye, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadStep } from "./steps/UploadStep";
import { CreateSettingStep } from "./steps/CreateSettingStep";
import { SegmentedPreviewStep } from "./steps/SegmentedPreviewStep";
import { ProcessDataStep } from "./steps/ProcessDataStep";
import { Progress } from "../ui/progress";

type Step = 1 | 2 | 3 | 4;

interface StepConfig {
  id: Step;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {
    id: 1,
    title: "Upload Files",
    description: "Upload your documents (DOCX, PPTX, PDF, TXT)",
    icon: <Upload className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Create Setting",
    description: "Configure knowledge settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Segmented Preview",
    description: "Preview segmented content",
    icon: <Eye className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Process Data",
    description: "Process and finalize knowledge",
    icon: <Database className="w-5 h-5" />,
  },
];



export const CreateNewKnowledge = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedSegmentationOption, setSelectedSegmentationOption] = useState<string | null>(null);

  const handleNextStep = () => {
    // Validate step 1: must have uploaded files
    if (currentStep === 1 && uploadedFiles.length === 0) {
      return;
    }
    
    // Validate step 2: must have selected segmentation option
    if (currentStep === 2 && !selectedSegmentationOption) {
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleStepClick = (stepId: Step) => {
    setCurrentStep(stepId);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <UploadStep
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <CreateSettingStep 
            onNext={handleNextStep} 
            onPrev={handlePrevStep}
            selectedOption={selectedSegmentationOption}
            onOptionSelect={setSelectedSegmentationOption}
          />
        );
      case 3:
        return (
          <SegmentedPreviewStep 
            onNext={handleNextStep} 
            onPrev={handlePrevStep}
            uploadedFiles={uploadedFiles}
            selectedSegmentationOption={selectedSegmentationOption}
          />
        );
      case 4:
        return <ProcessDataStep onPrev={handlePrevStep} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className=" mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create New Knowledge</h1>
        <p className="text-muted-foreground">
          Follow the steps below to create and configure your knowledge base
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isAccessible = step.id <= currentStep;

          return (
            <Card
              key={step.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isActive && "ring-2 ring-primary border-primary",
                isCompleted && "bg-green-50 border-green-200",
                !isAccessible && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => isAccessible && handleStepClick(step.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-green-500 text-white",
                      !isActive && !isCompleted && "bg-muted"
                    )}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm">{step.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="min-h-[500px]">
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>
    </div>
  );
};