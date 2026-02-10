import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import RuleCard from "./RuleCard"
import AuthoritySummaryBar from "./AuthoritySummaryBar"
import DomainIcon from "@/components/shared/DomainIcon"
import { DOMAINS, DOMAIN_CONFIG } from "@/lib/constants"
import type { AuthorityRule, AuthorityLevel } from "@/data/types"
import { Plus } from "lucide-react"

interface AuthorityProfileProps {
  partnerId: string
  rules: AuthorityRule[]
}

export default function AuthorityProfile({
  partnerId,
  rules,
}: AuthorityProfileProps) {
  const [localRules, setLocalRules] = useState(rules)
  const partnerRules = localRules.filter((r) => r.partnerId === partnerId)

  // Find domains that have rules
  const domainsWithRules = DOMAINS.filter((d) =>
    partnerRules.some((r) => r.domain === d)
  )

  const defaultDomain = domainsWithRules[0] || "internal-scheduling"

  const handleLevelChange = (ruleId: string, newLevel: AuthorityLevel) => {
    setLocalRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, level: newLevel } : r))
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-4">
      {/* Summary bar */}
      <AuthoritySummaryBar
        rules={partnerRules}
        lastReviewed="3 days ago"
        lastReviewedDays={3}
      />

      {/* Domain tabs + rules */}
      <Tabs defaultValue={defaultDomain} className="flex min-h-0 flex-1 flex-col">
        <TabsList className="w-full shrink-0 flex-wrap justify-start">
          {domainsWithRules.map((domain) => {
            const domainRules = partnerRules.filter((r) => r.domain === domain)
            return (
              <TabsTrigger
                key={domain}
                value={domain}
                className="gap-1.5 text-xs"
              >
                <DomainIcon domain={domain} size={14} />
                {DOMAIN_CONFIG[domain].label}
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {domainRules.length}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {domainsWithRules.map((domain) => {
          const domainRules = partnerRules.filter((r) => r.domain === domain)
          return (
            <TabsContent
              key={domain}
              value={domain}
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <div className="space-y-3 pr-4">
                {domainRules.map((rule) => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onLevelChange={handleLevelChange}
                  />
                ))}

                {/* + Add Rule button */}
                <Button
                  variant="outline"
                  className="w-full gap-2 border-dashed text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Rule
                </Button>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
