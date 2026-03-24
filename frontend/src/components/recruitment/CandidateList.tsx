import CandidateCard from "./CandidateCard";

interface CandidateListProps {
  candidates: any[];
}

const CandidateList = ({ candidates }: CandidateListProps) => {
  if (!candidates.length) {
    return <p className="text-sm text-muted-foreground">No candidates found for this query.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {candidates.map((candidate, index) => (
        <CandidateCard key={candidate?.id || candidate?._id || `${candidate?.linkedin_url || "candidate"}-${index}`} candidate={candidate} />
      ))}
    </div>
  );
};

export default CandidateList;
