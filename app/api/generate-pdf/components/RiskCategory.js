import { RiskFactor } from "./RiskFactor";

export const RiskCategory = (title, factors) => `
<div class="risk-category">
    <h2>${title}</h2>
    ${factors
      .map((factor) => 
        RiskFactor(factor.name, factor.description, "https://www.google.com")
      )
      .join("")}
</div>
`;
