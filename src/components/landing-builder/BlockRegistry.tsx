import { BlockDefinition } from "./types";
import { NavbarBlockDef } from "./blocks/NavbarBlock";
import { HeroBlockDef } from "./blocks/HeroBlock";
import { TemplateShowcaseBlockDef } from "./blocks/TemplateShowcaseBlock";
import { FeatureGridDef } from "./blocks/FeatureGridBlock";
import { HowItWorksBlockDef } from "./blocks/HowItWorksBlock";
import { PricingBlockDef } from "./blocks/PricingBlock";
import { TestimonialBlockDef } from "./blocks/TestimonialBlock";
import { FAQBlockDef } from "./blocks/FAQBlock";
import { CallToActionBlockDef } from "./blocks/CallToActionBlock";
import { FooterBlockDef } from "./blocks/FooterBlock";

// Register all available blocks here
export const BlockRegistry: Record<string, BlockDefinition<any>> = {
  [NavbarBlockDef.type]: NavbarBlockDef,
  [HeroBlockDef.type]: HeroBlockDef,
  [TemplateShowcaseBlockDef.type]: TemplateShowcaseBlockDef,
  [FeatureGridDef.type]: FeatureGridDef,
  [HowItWorksBlockDef.type]: HowItWorksBlockDef,
  [PricingBlockDef.type]: PricingBlockDef,
  [TestimonialBlockDef.type]: TestimonialBlockDef,
  [FAQBlockDef.type]: FAQBlockDef,
  [CallToActionBlockDef.type]: CallToActionBlockDef,
  [FooterBlockDef.type]: FooterBlockDef,
};
