import { Component, HostBinding, Input, Optional, Self } from "@angular/core";
import { ControlValueAccessor, NgControl, Validators } from "@angular/forms";

import { BitFormFieldControl } from "../form-field/form-field-control";

import { Checkmark } from "./checkmark.icon";

let nextId = 0;

@Component({
  selector: "bit-checkbox",
  templateUrl: "checkbox.component.html",
  providers: [{ provide: BitFormFieldControl, useExisting: CheckboxComponent }],
})
export class CheckboxComponent implements ControlValueAccessor, BitFormFieldControl {
  id = `bit-checkbox-${nextId++}`;

  private _name?: string;
  @Input() get name() {
    return this._name ?? this.ngControl?.name?.toString();
  }
  set name(value: string) {
    this._name = value;
  }

  protected checkmark = `url('data:image/svg+xml;utf8,${encodeURI(Checkmark.svg)}')`;

  protected inputClasses = [
    "tw-appearance-none",
    "tw-outline-none",

    "tw-transition",
    "tw-inline-block",
    "tw-rounded",
    "tw-border",
    "tw-border-solid",
    "tw-h-3.5",
    "tw-w-3.5",
    "tw-mr-1.5",
    "tw-bg-center",
    "tw-bg-no-repeat",
    "tw-bg-background",
    "tw-border-secondary-500",

    // Fix checkbox looking off-center
    "tw-relative",
    "tw-bottom-[-1px]",

    "group-hover:tw-border-2",

    "focus-visible:tw-ring-2",
    "focus-visible:tw-ring-offset-2",
    "focus-visible:tw-ring-primary-700",

    "disabled:tw-border",
    "disabled:tw-bg-secondary-100",

    "checked:tw-bg-primary-500",
    "checked:tw-border-primary-500",

    "checked:group-hover:tw-bg-primary-700",
    "checked:group-hover:tw-border-primary-700",

    "checked:disabled:tw-border-secondary-100",
    "checked:disabled:tw-bg-secondary-100",

    "tw-relative",
    "before:tw-content-['']",
    "before:tw-block",
    "before:tw-absolute",
    "before:tw-inset-0",
    `before:tw-bg-[${this.checkmark}]`,
  ];

  protected labelClasses = [
    "tw-group",
    "tw-transition",
    "tw-cursor-pointer",
    "tw-select-none",
    "tw-mb-0",

    "peer-disabled:tw-cursor-auto",
  ];

  protected labelContentClasses = [
    "tw-font-semibold",
    "tw-text-main",

    "group-peer-disabled:tw-text-muted",
  ];

  protected labelTextClasses = ["tw-transition", "group-peer-checked:tw-bg-text-main"];

  protected checked: boolean;
  protected disabled = false;

  constructor(@Optional() @Self() private ngControl?: NgControl) {
    if (ngControl != null) {
      ngControl.valueAccessor = this;
    }
  }

  // ControlValueAccessor
  onChange: (value: boolean) => void;
  onTouched: () => void;

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // BitFormFieldControl
  @HostBinding("attr.aria-describedby")
  ariaDescribedBy: string;

  get labelForId() {
    return this.id;
  }

  @Input()
  get required() {
    return (
      this._required ?? this.ngControl?.control?.hasValidator(Validators.requiredTrue) ?? false
    );
  }
  set required(value: any) {
    this._required = value != null && value !== false;
  }
  private _required: boolean;

  @Input() hasPrefix = false;
  @Input() hasSuffix = false;

  get hasError() {
    return this.ngControl?.status === "INVALID" && this.ngControl?.touched;
  }

  get error(): [string, any] {
    const key = Object.keys(this.ngControl.errors)[0];
    return [key, this.ngControl.errors[key]];
  }

  protected onInputChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    this.checked = event.target.checked;
    this.onChange(this.checked);
  }

  protected onBlur() {
    this.onTouched();
  }
}
