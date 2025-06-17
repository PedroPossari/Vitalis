import { FieldValues, Control, FieldPath } from "react-hook-form";
import { Input, InputProps } from "./input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";

interface FormInputProps<T extends FieldValues> extends InputProps {
    control: Control<T>;
    name: FieldPath<T>;
    label?: string;
    description?: string;
}

export default function FormInput<T extends FieldValues>({ control, label, name, description, ...props}: FormInputProps<T>) {
    return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input 
                {...props}
                {...field} />
              </FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    );
}