import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TopicInput({ SetTopic, setDifficultyLevel }) {
  return (
    <div>
      <h2> Please type or copy paste what you would like AI to create a study material for. </h2>
      <Textarea
        placeholder="Start writing here"
        className="mt-2 w-full"
        onChange={(event) => SetTopic(event.target.value)}
      />

      <h2 className="mt-5 mb-3"> Please select the difficulty level. </h2>
      <Select onValueChange={(value) => setDifficultyLevel(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Difficulty level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TopicInput;
