const fs = require('fs');

let path = 'src/server/core/hdme1/engines/ActionAuthorizationEngine.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    'decision.authorizationReason = decision.authorizationReason || "No options passed policy or risk thresholds.";',
    `let reason = "Rejected because:\\n";
            for (const option of decision.options) {
                reason += \`- Option \${option.id}: Risk = \${(option.riskScore || 0).toFixed(2)}, Utility = \${(option.utilityScore || 0).toFixed(2)}, Policy Passed = \${option.policyPassed}.\\n\`;
                if ((option.riskScore || 0) >= 0.8) {
                    reason += \`  Reason: Risk exceeds threshold (0.80).\\n\`;
                } else if (!option.policyPassed) {
                    reason += \`  Reason: Policy check failed.\\n\`;
                } else {
                    reason += \`  Reason: Utility score too low.\\n\`;
                }
            }
            if (decision.options.length === 0) reason += "No options provided.\\n";
            decision.authorizationReason = reason;`
);

fs.writeFileSync(path, code);
console.log("Patched ActionAuthorizationEngine");
