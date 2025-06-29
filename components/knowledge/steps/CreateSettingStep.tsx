"use client";

import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Settings, Zap, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface SegmentationOption {
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface CreateSettingStepProps {
  onNext: () => void;
  onPrev: () => void;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

const segmentationOptions: SegmentationOption[] = [
  {
    name: 'Automatic segmentation & Cleaning',
    description: 'Automatic segmentation & Preprocessing rules',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    name: 'Custom',
    description: 'Custom segmentation rules & Segment length & Preprocessing rules',
    icon: <Wrench className="w-6 h-6" />,
  },
];

export const CreateSettingStep = ({ onNext, onPrev, selectedOption, onOptionSelect }: CreateSettingStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Create Setting</h2>
        <p className="text-muted-foreground">
          Choose your segmentation and preprocessing approach
        </p>
      </div>

      {/* Segmentation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segmentationOptions.map((option) => {
          const isSelected = selectedOption === option.name;
          
          return (
            <Card
              key={option.name}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                isSelected 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onOptionSelect(option.name)}
            >
              <CardHeader className="text-center">
                <div className={cn(
                  "mx-auto p-3 rounded-full mb-2",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {option.icon}
                </div>
                <CardTitle className="text-lg">{option.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Option Info */}
      {selectedOption && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-700">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Selected: {selectedOption}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous: Upload
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedOption}
          className={cn(
            !selectedOption && "opacity-50 cursor-not-allowed"
          )}
        >
          Next: Segmented Preview
        </Button>
      </div>
    </div>
  );
};