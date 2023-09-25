// @flow
import React from "react";
import { useForm, Resolver, SubmitHandler, FieldValues } from "react-hook-form";
import { Form } from "reactstrap";

interface VerticalFormProps<TFormValues extends FieldValues> {
  defaultValues?: any;
  resolver?: Resolver<TFormValues>;
  children?: any;
  onSubmit: SubmitHandler<TFormValues>;
  formClass?: string;
}


const VerticalForm = <
  TFormValues extends Record<string, any> = Record<string, any>
>({
  defaultValues,
  resolver,
  children,
  onSubmit,
  formClass,
}: VerticalFormProps<TFormValues>) => {
  /*
   * form methods
   */
  const methods = useForm<TFormValues>({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={formClass} noValidate>
      {Array.isArray(children)
        ? children.map(child => {
            return child.props && child.props.name
              ? React.createElement(child.type, {
                  ...{
                    ...child.props,
                    register,
                    key: child.props.name,
                    errors,
                    control,
                  },
                })
              : child;
          })
        : children}
    </Form>
  );
};

export default VerticalForm;
