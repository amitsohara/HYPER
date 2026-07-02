import { DecisionOption, DecisionContext, DecisionPolicy } from "../types.js";

export class ExecutivePolicyEngine {
    private policies: DecisionPolicy[] = [];

    registerPolicy(policy: DecisionPolicy) {
        this.policies.push(policy);
    }

    evaluate(context: DecisionContext, option: DecisionOption): DecisionOption {
        let passed = true;
        for (const policy of this.policies) {
            if (!policy.evaluate(context, option)) {
                passed = false;
                break;
            }
        }
        option.policyPassed = passed;
        return option;
    }
}
