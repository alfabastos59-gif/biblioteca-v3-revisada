import { describe, expect, it } from "vitest";
import { isAdminPinValid, replaceAdminPin } from "../shared/admin-security";

describe("replaceAdminPin", () => {
  it("discards the old PIN when a new one is provided", () => {
    expect(replaceAdminPin("senha-antiga", " nova-senha ")).toBe("nova-senha");
    expect(replaceAdminPin("senha-antiga", "nova-senha")).not.toBe("senha-antig nova-senha");
  });

  it("keeps the current PIN when editing without a new value", () => {
    expect(replaceAdminPin("senha-atual", "   ")).toBe("senha-atual");
  });

  it("allows a new administrator to be created without an old PIN", () => {
    expect(replaceAdminPin(undefined, "1234")).toBe("1234");
  });

  it("accepts only the current PIN, not the replaced one or the old master fallback", () => {
    const currentPin = replaceAdminPin("adm123", "nova-senha");
    expect(isAdminPinValid(currentPin, "nova-senha")).toBe(true);
    expect(isAdminPinValid(currentPin, "adm123")).toBe(false);
  });
});
