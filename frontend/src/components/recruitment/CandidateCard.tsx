import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CandidateCardProps {
  candidate: any;
}

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const fullName =
    candidate?.name ||
    [candidate?.first_name, candidate?.last_name].filter(Boolean).join(" ") ||
    "Unknown Candidate";
  const title = candidate?.title || candidate?.headline || "N/A";
  const company = candidate?.organization?.name || candidate?.company_name || "N/A";
  const location = candidate?.city
    ? `${candidate.city}${candidate.state ? `, ${candidate.state}` : ""}`
    : candidate?.location || "N/A";
  const linkedin = candidate?.linkedin_url;
  const email = candidate?.email || candidate?.primary_email || "N/A";

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-foreground">{fullName}</h4>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-200">
          Pending AI Ranking
        </Badge>
      </div>
      <p className="text-sm"><span className="font-medium">Company:</span> {company}</p>
      <p className="text-sm"><span className="font-medium">Location:</span> {location}</p>
      <p className="text-sm">
        <span className="font-medium">LinkedIn:</span>{" "}
        {linkedin ? (
          <a href={linkedin} target="_blank" rel="noreferrer" className="text-primary underline">
            View Profile
          </a>
        ) : (
          "N/A"
        )}
      </p>
      <p className="text-sm"><span className="font-medium">Email:</span> {email}</p>
    </Card>
  );
};

export default CandidateCard;
