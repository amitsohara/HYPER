import { GoogleGenAI } from "@google/genai";
import { ExecutiveSummaryGenerator } from "./executive_summary_generator.js";
import { RiskBudgetExtractor } from "./risk_budget_extractor.js";
import { ActionPlanGenerator } from "./action_plan_generator.js";

export interface DomainCompiler {
  compile(ai: GoogleGenAI, normalizedData: any): Promise<any>;
}

export class DefaultDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData),
      RiskBudgetExtractor.extract(ai, normalizedData),
      ActionPlanGenerator.generate(ai, normalizedData)
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class BusinessDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData, "Focus on market size, competitive advantage, revenue potential, and scalability."),
      RiskBudgetExtractor.extract(ai, normalizedData, "Focus on CAPEX/OPEX, burn rate, VC funding milestones, and business risks (market, execution)."),
      ActionPlanGenerator.generate(ai, normalizedData, "Focus on product-market fit, Go-To-Market strategy, hiring key executives, and sales pipeline.")
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class HealthcareDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData, "Focus on patient outcomes, clinical trials, regulatory compliance (FDA/HIPAA), and medical efficacy."),
      RiskBudgetExtractor.extract(ai, normalizedData, "Focus on R&D costs, clinical trial funding, regulatory approval risks, and safety mitigation."),
      ActionPlanGenerator.generate(ai, normalizedData, "Focus on Phase I/II/III trials, regulatory submissions, hospital partnerships, and ethical review boards.")
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class ManufacturingDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData, "Focus on supply chain efficiency, production capacity, automation, and unit economics."),
      RiskBudgetExtractor.extract(ai, normalizedData, "Focus on factory tooling costs, raw material volatility, logistics risks, and equipment maintenance."),
      ActionPlanGenerator.generate(ai, normalizedData, "Focus on factory setup, supplier negotiations, QA/QC processes, and inventory management.")
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class ResearchDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData, "Focus on hypothesis, methodology, literature review gaps, and scientific impact."),
      RiskBudgetExtractor.extract(ai, normalizedData, "Focus on grant funding, lab equipment, data collection risks, and peer review potential."),
      ActionPlanGenerator.generate(ai, normalizedData, "Focus on experiment design, data analysis, paper drafting, and conference submission.")
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class GovernmentDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData, "Focus on policy impact, societal outcomes, geopolitical analysis, and strategic statecraft."),
      RiskBudgetExtractor.extract(ai, normalizedData, "Focus on systemic risks, political instability, public funding, infrastructure requirements, and humanitarian impact."),
      ActionPlanGenerator.generate(ai, normalizedData, "Focus on policy implementation, diplomatic negotiations, crisis response phases, and public relations.")
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class EngineeringDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData, "Focus on engineering design, system architecture, safety margins, and structural integrity. DO NOT use startup or business jargon (no MVP, no GTM)."),
      RiskBudgetExtractor.extract(ai, normalizedData, "Focus on material costs, physics/engineering risks, environmental hazards, and construction timelines. DO NOT use VC or startup financial terms."),
      ActionPlanGenerator.generate(ai, normalizedData, "Focus on design phases, prototyping, testing, and deployment/construction. Replace business terms with engineering terms.")
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class SoftwareDomainCompiler implements DomainCompiler {
  async compile(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    const [execSummary, riskBudget, actionPlan] = await Promise.all([
      ExecutiveSummaryGenerator.generate(ai, normalizedData, "Focus on software architecture, user experience, scalability, and technical debt. DO NOT use startup jargon unless explicitly requested."),
      RiskBudgetExtractor.extract(ai, normalizedData, "Focus on cloud costs, technical risks, security vulnerabilities, and development time."),
      ActionPlanGenerator.generate(ai, normalizedData, "Focus on sprints, architecture design, coding, testing, and deployment.")
    ]);
    return { ...execSummary, ...riskBudget, ...actionPlan };
  }
}

export class DomainCompilerFactory {
  static getCompiler(type: string): DomainCompiler {
    switch (type.toLowerCase()) {
      case "business":
        return new BusinessDomainCompiler();
      case "healthcare":
        return new HealthcareDomainCompiler();
      case "manufacturing":
        return new ManufacturingDomainCompiler();
      case "research":
        return new ResearchDomainCompiler();
      case "government":
      case "social":
      case "geopolitical":
        return new GovernmentDomainCompiler();
      case "engineering":
        return new EngineeringDomainCompiler();
      case "software":
        return new SoftwareDomainCompiler();
      default:
        return new DefaultDomainCompiler();
    }
  }
}
