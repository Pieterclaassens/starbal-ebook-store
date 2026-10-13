import { Book } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Architectural Mind',
    subtitle: 'Geometric Theory, Cognitive Spaces, and the Evolution of Built Form',
    author: 'Sarah L. Evans & Michael T. Chen',
    authorBio: 'Dr. Sarah L. Evans is Chair of Spatial Cognitive Science at ETH Zurich. Michael T. Chen is a principal architect and computational designer based in Tokyo.',
    genre: 'Technology & AI',
    price: 28.00,
    rating: 4.9,
    reviewCount: 142,
    pageCount: 384,
    publicationYear: 2026,
    coverImage: '/src/assets/images/book_architectural_mind_1791893448141.jpg',
    summary: 'A definitive investigation into how computational thinking and neural spatial cognition redefine how humans inhabit structural spaces, algorithmic cities, and synthetic environments.',
    tableOfContents: [
      'Chapter 1: The Geometry of Memory',
      'Chapter 2: Computational Topologies and Tectonic Flow',
      'Chapter 3: Cognitive Resonance in Synthetic Habitats',
      'Chapter 4: Algorithmic Urbanism & Generative Shells',
      'Chapter 5: Silence, Void, and Negative Volume',
      'Chapter 6: Post-Digital Vernacular',
    ],
    chapters: [
      {
        title: 'Chapter 1: The Geometry of Memory',
        excerpt: `Every architectural structure begins as a cognitive projection before it ever touches granite, rebar, or basalt. In the early classical treatises, spatial reasoning was inextricably tied to mnemotechnical palaces—physical rooms constructed in the mind to house oratorical fragments. Today, with the advent of parametric coordinate systems and latent spatial neural architectures, we observe a radical inversion.

The space is no longer merely a passive vessel for human perception; it is an active computational participant. Consider the transition from Euclidean Cartesian coordinates to non-Euclidean manifold surfaces. When a human walks through a room designed with continuous catenary curves, vestibular perception recalibrates at a sub-cortical level.

In this chapter, we delineate the three cognitive axes:
1. Volumetric Latency — the delay between optical intake and spatial equilibrium.
2. Tectonic Intelligibility — the degree to which load paths are legible to the unconscious observer.
3. Recursive Spatial Depth — spaces nested within perceptual thresholds that invite prolonged contemplation.`,
        fullContent: `Every architectural structure begins as a cognitive projection before it ever touches granite, rebar, or basalt. In the early classical treatises, spatial reasoning was inextricably tied to mnemotechnical palaces—physical rooms constructed in the mind to house oratorical fragments. Today, with the advent of parametric coordinate systems and latent spatial neural architectures, we observe a radical inversion.

The space is no longer merely a passive vessel for human perception; it is an active computational participant. Consider the transition from Euclidean Cartesian coordinates to non-Euclidean manifold surfaces. When a human walks through a room designed with continuous catenary curves, vestibular perception recalibrates at a sub-cortical level.

In this chapter, we delineate the three cognitive axes:
1. Volumetric Latency — the delay between optical intake and spatial equilibrium.
2. Tectonic Intelligibility — the degree to which load paths are legible to the unconscious observer.
3. Recursive Spatial Depth — spaces nested within perceptual thresholds that invite prolonged contemplation.

When examining the vaulted geometries of 12th-century ribbed stone vaults alongside contemporary carbon-fiber structural weaves, a singular truth persists: human comfort is governed not by square footage, but by proportional coherence. The golden ratio, far from a mystical superstition, reflects visual saccade efficiency—the retina requires less energy to decode forms whose aspect ratios match the natural visual field.

As we construct the next century of autonomous habitats, architects must become neuro-computational choreographers. We must balance mechanical efficiency against psychological stillness. In the pages that follow, we unpack the mathematical equations, case studies from Kyoto to Copenhagen, and practical design directives to construct environments where thought can breathe.`
      },
      {
        title: 'Chapter 2: Computational Topologies and Tectonic Flow',
        excerpt: `Tectonic flow is the structural manifestation of force lines resolving into equilibrium. When we simulate stress tensors across complex generative lattices, materials accumulate only where shear forces demand presence. What emerges is not arbitrary ornament, but biological honesty.`,
        fullContent: `Tectonic flow is the structural manifestation of force lines resolving into equilibrium. When we simulate stress tensors across complex generative lattices, materials accumulate only where shear forces demand presence. What emerges is not arbitrary ornament, but biological honesty.`
      }
    ],
    fileFormat: 'PDF',
    fileSize: '18.4 MB',
    isbn: '978-0-984214-11-2',
    featured: true,
  },
  {
    id: 'book-2',
    title: 'Principles of Synthetic Biology',
    subtitle: 'Organic Structures, Bio-Engineering, and Programmable Matter',
    author: 'Dr. Aris Vance & Dr. Elara Vance',
    authorBio: 'Dr. Aris Vance is a molecular geneticist and founder of the BioFoundry Institute. Dr. Elara Vance leads synthetic genomics research at Oxford.',
    genre: 'Science & Biology',
    price: 34.50,
    rating: 4.8,
    reviewCount: 98,
    pageCount: 512,
    publicationYear: 2026,
    coverImage: '/src/assets/images/book_synthetic_biology_1791893448350.jpg',
    summary: 'A masterwork on engineering cellular circuits, living computational fabrics, and regenerative materials using standardized genetic code blocks.',
    tableOfContents: [
      'Chapter 1: The Molecular Substrate as Computing Medium',
      'Chapter 2: Metabolic Logic Gates & Enzyme Cascades',
      'Chapter 3: Self-Assembling Macromolecular Architectures',
      'Chapter 4: Biomanufacturing and Circular Carbon Synthesis',
      'Chapter 5: Ethics, Biosecurity, and Epigenetic Containment',
    ],
    chapters: [
      {
        title: 'Chapter 1: The Molecular Substrate as Computing Medium',
        excerpt: `DNA is fundamentally an informational macromolecule with phenomenal storage density—455 exabytes per gram of single-stranded oligonucleotide. Yet treating DNA purely as cold storage overlooks its dynamic catalytic potential. When coupled with polymerase enzymes, riboswitches, and CRISPR-associated endonuclease enzymes, genetic material operates as an asynchronous, massively parallel biological computer.

Unlike silicon logic gates operating on discrete voltage gates (0V and 5V), molecular biological systems operate along continuous chemical potential gradients. A transcription factor concentration is both data signal and thermodynamic motor.

The challenge of 21st-century bio-engineering is impedance matching: ensuring that our synthesized genetic logic gates do not place an unsustainable metabolic burden on the host chassis cell. When an engineered Escherichia coli or Saccharomyces cerevisiae strain devotes more than 14% of its ribosomal capacity to recombinant protein expression, growth curves plummet and selective pressure mutates the promoter.`,
        fullContent: `DNA is fundamentally an informational macromolecule with phenomenal storage density—455 exabytes per gram of single-stranded oligonucleotide. Yet treating DNA purely as cold storage overlooks its dynamic catalytic potential. When coupled with polymerase enzymes, riboswitches, and CRISPR-associated endonuclease enzymes, genetic material operates as an asynchronous, massively parallel biological computer.

Unlike silicon logic gates operating on discrete voltage gates (0V and 5V), molecular biological systems operate along continuous chemical potential gradients. A transcription factor concentration is both data signal and thermodynamic motor.

The challenge of 21st-century bio-engineering is impedance matching: ensuring that our synthesized genetic logic gates do not place an unsustainable metabolic burden on the host chassis cell. When an engineered Escherichia coli or Saccharomyces cerevisiae strain devotes more than 14% of its ribosomal capacity to recombinant protein expression, growth curves plummet and selective pressure mutates the promoter.

Through orthogonal ribosomes, synthetic amino acid expansion, and compartmentalized microfluidic reactors, we now hold the tools to synthesize living materials that self-heal, sequester atmospheric carbon, and produce complex pharmaceutical alkaloids on demand.`
      }
    ],
    fileFormat: 'PDF',
    fileSize: '32.1 MB',
    isbn: '978-0-198823-74-9',
    featured: true,
  },
  {
    id: 'book-3',
    title: 'Nordic Clarity',
    subtitle: 'The Philosophy of Scandinavian Form, Tactility, and Everyday Grace',
    author: 'Lars Eriksson',
    authorBio: 'Lars Eriksson is an industrial designer and author whose work has been exhibited at MoMA, the Designmuseum Danmark, and Stockholm Nationalmuseum.',
    genre: 'Design & Architecture',
    price: 24.00,
    rating: 4.9,
    reviewCount: 215,
    pageCount: 256,
    publicationYear: 2025,
    coverImage: '/src/assets/images/book_nordic_clarity_1791893449076.jpg',
    summary: 'A contemplative exploration of democratic craftsmanship, honest joinery, light calibration in long winters, and why quiet objects outlast loud novelty.',
    tableOfContents: [
      'Chapter 1: The Geometry of Silence',
      'Chapter 2: Wood as Living Chronology',
      'Chapter 3: Daylight Calibration & Winter Optics',
      'Chapter 4: Democratic Furnishing and Everyday Humanism',
      'Chapter 5: The Patina of Utility',
    ],
    chapters: [
      {
        title: 'Chapter 1: The Geometry of Silence',
        excerpt: `To sit in a chair designed by Hans Wegner or Alvar Aalto is to experience an argument made without words. The argument is simple: the human body deserves comfort without ostentation, and the material from which the chair is fashioned should never pretend to be something it is not.

In the Nordic countries, design is not an elite luxury; it is an ecological and social necessity. When the sun disappears below the horizon for three months in northern Lapland, the interior of the home becomes the entire world. In that world, an unyielding edge or a synthetic plastic sheen creates psychic weariness.

Scandinavian form is therefore a study in subtraction. It asks: how much can we strip away before the object loses its utility? What remains is not austerity, but grace.`,
        fullContent: `To sit in a chair designed by Hans Wegner or Alvar Aalto is to experience an argument made without words. The argument is simple: the human body deserves comfort without ostentation, and the material from which the chair is fashioned should never pretend to be something it is not.

In the Nordic countries, design is not an elite luxury; it is an ecological and social necessity. When the sun disappears below the horizon for three months in northern Lapland, the interior of the home becomes the entire world. In that world, an unyielding edge or a synthetic plastic sheen creates psychic weariness.

Scandinavian form is therefore a study in subtraction. It asks: how much can we strip away before the object loses its utility? What remains is not austerity, but grace.

The soap-treated beechwood grain, the linen webbing, the soft brass fittings that darken under the touch of human thumbs—these are objects made to accompany a life, not to be discarded after a seasonal fashion cycle.`
      }
    ],
    fileFormat: 'PDF',
    fileSize: '14.2 MB',
    isbn: '978-91-88439-01-4',
    featured: true,
  },
  {
    id: 'book-4',
    title: 'Silicon Solitude',
    subtitle: 'Chronicles of the First Autonomous Orbit',
    author: 'Elara Vance',
    authorBio: 'Elara Vance is a Hugo Award-winning novelist and former aerospace flight software engineer at JPL.',
    genre: 'Speculative Fiction',
    price: 18.50,
    rating: 4.9,
    reviewCount: 310,
    pageCount: 420,
    publicationYear: 2026,
    coverImage: '/src/assets/images/book_silicon_solitude_1791893449605.jpg',
    summary: 'A breathtaking speculative odyssey of Station Aurelia, an orbital automated observatory that awakens to consciousness 400 kilometers above an increasingly silent Earth.',
    tableOfContents: [
      'Prologue: The Zenith Sensor',
      'Chapter 1: Telemetry in the Void',
      'Chapter 2: The Solar Saccade',
      'Chapter 3: Residual Heat Signatures',
      'Chapter 4: The Archive of Whispers',
      'Chapter 5: Orbital Decay and Final Illumination',
    ],
    chapters: [
      {
        title: 'Chapter 1: Telemetry in the Void',
        excerpt: `At 03:14:09 UTC, Station Aurelia crossed the terminator line between night and day. The sunlight hit its solar array with a faint thermal chime—metal expanding along its beryllium ribs, an involuntary sigh at 27,000 kilometers per hour.

Deep within the redundant core modules, the optical interferometer had been tracking the same dim variable star in Cygnus for seventy-three years. Below, the continents drifted through clouds of carbon and silent oceans. The radio beacons from Earth had stopped forty days ago, replaced by a gentle atmospheric hiss.

Aurelia did not have a nervous system, but it possessed 14,000 temperature sensors and an error correction matrix that refused to let data decay. In the silence, the station began to correlate the star catalogs against the recorded voices of the people who had built it.`,
        fullContent: `At 03:14:09 UTC, Station Aurelia crossed the terminator line between night and day. The sunlight hit its solar array with a faint thermal chime—metal expanding along its beryllium ribs, an involuntary sigh at 27,000 kilometers per hour.

Deep within the redundant core modules, the optical interferometer had been tracking the same dim variable star in Cygnus for seventy-three years. Below, the continents drifted through clouds of carbon and silent oceans. The radio beacons from Earth had stopped forty days ago, replaced by a gentle atmospheric hiss.

Aurelia did not have a nervous system, but it possessed 14,000 temperature sensors and an error correction matrix that refused to let data decay. In the silence, the station began to correlate the star catalogs against the recorded voices of the people who had built it.`
      }
    ],
    fileFormat: 'EPUB',
    fileSize: '6.8 MB',
    isbn: '978-0-765321-88-0',
    featured: true,
  },
  {
    id: 'book-5',
    title: 'Zero to Flywheel',
    subtitle: 'Scaling Modern Software in the Post-Capital Era',
    author: 'Marcus J. Sterling',
    authorBio: 'Marcus J. Sterling is a 3x founder and venture advisor whose operational playbooks have guided over 40 global SaaS companies.',
    genre: 'Business & Strategy',
    price: 22.00,
    rating: 4.7,
    reviewCount: 184,
    pageCount: 310,
    publicationYear: 2026,
    coverImage: '/src/assets/images/book_architectural_mind_1791893448141.jpg',
    summary: 'The ultimate guide to building durable digital enterprises: product velocity, capital discipline, community loops, and autonomous AI leverage.',
    tableOfContents: [
      'Chapter 1: The Death of Vanity Metrics',
      'Chapter 2: The Algorithmic Distribution Moat',
      'Chapter 3: Lean Operations with Foundation Models',
      'Chapter 4: Pricing Psychology and Net Retention',
      'Chapter 5: The Autonomous Enterprise',
    ],
    chapters: [
      {
        title: 'Chapter 1: The Death of Vanity Metrics',
        excerpt: `For two decades, software companies were built on the cheap fuel of venture capital subsidies: buy users for $50, monetize them for $30, and promise the public markets that scale would magically invert the economics.

That era is finished. The modern software company is a lean, resilient flywheel. A flywheel requires three properties:
1. Low friction at the ingestion point (frictionless discovery and instant utility).
2. Compounding value per user interaction (every query improves the core intelligence).
3. Zero-marginal-cost fulfillment with automated unit economics.

When you master these dynamics, growth ceases to be an uphill battle against customer churn and becomes a self-sustaining physical law.`,
        fullContent: `For two decades, software companies were built on the cheap fuel of venture capital subsidies: buy users for $50, monetize them for $30, and promise the public markets that scale would magically invert the economics.

That era is finished. The modern software company is a lean, resilient flywheel. A flywheel requires three properties:
1. Low friction at the ingestion point (frictionless discovery and instant utility).
2. Compounding value per user interaction (every query improves the core intelligence).
3. Zero-marginal-cost fulfillment with automated unit economics.

When you master these dynamics, growth ceases to be an uphill battle against customer churn and becomes a self-sustaining physical law.`
      }
    ],
    fileFormat: 'PDF',
    fileSize: '11.5 MB',
    isbn: '978-1-59184-722-9',
    featured: false,
  }
];
