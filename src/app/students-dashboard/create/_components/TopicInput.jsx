import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TopicInput({ setTopic, setDifficultyLevel }) {
  return (
    <div className="mt-10 w-full flex flex-col">
      {/* Topic Input */}
      <h2 className="mb-2 text-lg font-medium">
        Enter topic or paste the content for which you want to generate a study material
      </h2>
      <Textarea
        placeholder="Start writing here..."
        className="mt-2 w-full"
        onChange={(event) => setTopic(event.target.value)} // Update parent state with the input value
      />

      {/* Difficulty Level Selector */}
      <h2 className="mt-5 mb-3 text-lg font-medium">Select the difficulty level</h2>
      <Select onValueChange={(value) => setDifficultyLevel(value)}> {/* Pass the selected value to the parent */}
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select difficulty level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Moderate">Moderate</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}