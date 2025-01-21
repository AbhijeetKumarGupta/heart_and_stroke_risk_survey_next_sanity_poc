import { RiskCategory } from "./RiskCategory";

export const PageContent = (data) => `
<div class="section">
    <h1>Your Risk Factors</h1>
    <p>Understanding your risk factors is the first step toward a healthier future. Here are the key areas to focus on:</p>
    ${RiskCategory("Risk to Manage", data["Risk to Manage"])}
    ${RiskCategory("Risk to be Aware of", data["Risk to be Aware of"])}
    ${RiskCategory("Keep it Up", data["Keep it Up"])}
</div>
`;
