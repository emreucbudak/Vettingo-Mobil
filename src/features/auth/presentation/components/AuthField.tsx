import React from "react";
import { Control, Controller } from "react-hook-form";
import { AuthenticationInput } from "../../domain/entities/Session";
import { Field } from "../../../../shared/presentation/components/ui";

type AuthFieldName = "email" | "password" | "name" | "surname" | "company";
type AuthFieldProps = Omit<
  React.ComponentProps<typeof Field>,
  "value" | "onChangeText" | "onBlur" | "error" | "ref"
> & {
  control: Control<AuthenticationInput>;
  name: AuthFieldName;
};

export function AuthField({ control, name, ...props }: AuthFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
        <Field
          {...props}
          ref={ref}
          value={value ?? ""}
          onChangeText={onChange}
          onBlur={onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
