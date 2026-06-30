export const BenchmarkPolicies = {
    MINIMUM_CONFIDENCE_THRESHOLD: 95, // 95% statistical confidence required to confirm an improvement
    REQUIRE_REPRODUCIBILITY: true,
    MAX_VARIANCE_ALLOWED: 0.05, // 5% maximum variance between runs
    AUTO_RETIRE_EASY_BENCHMARKS: true, // Retire benchmarks that consistently score 100%
    STRICT_REGRESSION_PREVENTION: true // Prevent any evolution that introduces severe regressions
};
