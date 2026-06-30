export const CognitivePolicies = {
    REQUIRE_INTERNAL_THINKING_FIRST: true, // Must complete at least one reasoning cycle before external tool
    REQUIRE_VERIFICATION: true, // Cannot bypass Verification
    REQUIRE_REFLECTION: true, // Cannot skip Reflection
    REQUIRE_LEARNING: true, // Cannot skip Learning
    FORBID_DIRECT_COMMUNICATION: true, // Specialists cannot talk to each other directly
    TOOL_JUSTIFICATION_REQUIRED: true, // Tools must have explicit justification
    MIN_CONFIDENCE_THRESHOLD: 0.6 // Minimum confidence required to output a decision without additional thinking
};
