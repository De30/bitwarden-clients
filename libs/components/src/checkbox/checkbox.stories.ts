import { Component, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Meta, moduleMetadata, Story } from "@storybook/angular";

import { I18nService } from "@bitwarden/common/src/abstractions/i18n.service";

import { FormControlModule } from "../form-control";
import { I18nMockService } from "../utils/i18n-mock.service";

import { CheckboxModule } from "./checkbox.module";

const template = `
  <form [formGroup]="formObj">
    <bit-form-control>
      <input type="checkbox" bitCheckbox formControlName="checkbox">
      <bit-form-control-label>Click me</bit-form-control-label>
    </bit-form-control>
  </form>`;

@Component({
  selector: "app-example",
  template,
})
class ExampleComponent {
  protected formObj = this.formBuilder.group({
    checkbox: [false, Validators.requiredTrue],
  });

  @Input() set checked(value: boolean) {
    this.formObj.patchValue({ checkbox: value });
  }

  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.formObj.disable();
    } else {
      this.formObj.enable();
    }
  }

  constructor(private formBuilder: FormBuilder) {}
}

export default {
  title: "Component Library/Form/Checkbox",
  component: ExampleComponent,
  decorators: [
    moduleMetadata({
      declarations: [ExampleComponent],
      imports: [FormsModule, ReactiveFormsModule, FormControlModule, CheckboxModule],
      providers: [
        {
          provide: I18nService,
          useFactory: () => {
            return new I18nMockService({
              required: "required",
              inputRequired: "Input is required.",
              inputEmail: "Input is not an email-address.",
            });
          },
        },
      ],
    }),
  ],
  args: {
    checked: false,
    disabled: false,
  },
} as Meta;

const DefaultTemplate: Story<ExampleComponent> = (args: ExampleComponent) => ({
  props: args,
  template: `<input type="checkbox" bitCheckbox [checked]="checked" [disabled]="disabled">`,
});

export const Default = DefaultTemplate.bind({});

const ControlTemplate: Story<ExampleComponent> = (args: ExampleComponent) => ({
  props: args,
  template: `<app-example [checked]="checked" [disabled]="disabled"></app-example>`,
});

export const Control = ControlTemplate.bind({});
