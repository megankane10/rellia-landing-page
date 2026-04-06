import { useQmsProgramPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_QMS_PROGRAM } from "@shared/cms/defaults"
import { QMS_PROGRAM_STATIC_BLOCKS } from "@shared/cms/programs/qms.static"
import ProgramPageLayout from "@/components/program/ProgramPageLayout"

const QMS_OUTCOMES_SECTION_ID = "qms-program-outcomes"

export default function ProgramsQms() {
  const { data } = useQmsProgramPage()
  const q = data ?? DEFAULT_QMS_PROGRAM

  return (
    <ProgramPageLayout
      cms={q}
      heroImageSrc="/images/QMS-programs.webp"
      heroImageAlt="Build Your QMS program"
      outcomesSectionId={QMS_OUTCOMES_SECTION_ID}
      staticBlocks={QMS_PROGRAM_STATIC_BLOCKS}
    />
  )
}
