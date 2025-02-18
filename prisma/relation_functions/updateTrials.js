import { db } from "../../src/server/db";

export default async function updateTrials() {
  const trials = await db.trial.findMany({
    include: {
      minions: true,
      emotes: true,
      hairstyles: true,
      cards: true,
      spells: true,
      orchestrions: true,
      mounts: true,
    }
  });

  for (const trial of trials) {
    // Find all potential new connections
    const minions = await db.minion.findMany({
      where: {
        sources: {
          some: {
            type: 'Trial',
            text: {
              equals: trial.name,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    const emotes = await db.emote.findMany({
      where: {
        sources: {
          some: {
            type: 'Trial',
            text: {
              equals: trial.name,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    const hairstyles = await db.hairstyle.findMany({
      where: {
        sources: {
          some: {
            type: 'Trial',
            text: {
              equals: trial.name,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    const cards = await db.card.findMany({
      where: {
        sources: {
          some: {
            type: 'Trial',
            text: {
              equals: trial.name,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    const spells = await db.spell.findMany({
      where: {
        sources: {
          some: {
            type: 'Trial',
            text: {
              equals: trial.name,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    const orchestrions = await db.orchestrion.findMany({
      where: {
        sources: {
          some: {
            type: 'Trial',
            text: {
              equals: trial.name,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    const mounts = await db.mount.findMany({
      where: {
        sources: {
          some: {
            type: 'Trial',
            text: {
              equals: trial.name,
              mode: 'insensitive',
            },
          },
        },
      },
    });


    // Get existing IDs
    const existingMinionIds = new Set(trial.minions.map(m => m.id));
    const existingEmoteIds = new Set(trial.emotes.map(e => e.id));
    const existingHairstyleIds = new Set(trial.hairstyles.map(h => h.id));
    const existingCardIds = new Set(trial.cards.map(c => c.id));
    const existingSpellIds = new Set(trial.spells.map(s => s.id));
    const existingOrchestrionIds = new Set(trial.orchestrions.map(o => o.id));
    const existingMountIds = new Set(trial.mounts.map(m => m.id));

    // Filter out only new connections
    const newMinions = minions.filter(m => !existingMinionIds.has(m.id));
    const newEmotes = emotes.filter(e => !existingEmoteIds.has(e.id));
    const newHairstyles = hairstyles.filter(h => !existingHairstyleIds.has(h.id));
    const newCards = cards.filter(c => !existingCardIds.has(c.id));
    const newSpells = spells.filter(s => !existingSpellIds.has(s.id));
    const newOrchestrions = orchestrions.filter(o => !existingOrchestrionIds.has(o.id));    
    const newMounts = mounts.filter(m => !existingMountIds.has(m.id));

    // Only update if there are new connections to add
    if (newMinions.length || newEmotes.length || newHairstyles.length || newCards.length || newSpells.length || newOrchestrions.length || newMounts.length) {
      await db.trial.update({
        where: {
          id: trial.id,
        },
        data: {
          minions: {
            connect: newMinions.map((m) => ({ id: m.id })),
          },
          emotes: {
            connect: newEmotes.map((m) => ({ id: m.id })),
          },
          hairstyles: {
            connect: newHairstyles.map((m) => ({ id: m.id })),
          },
          cards: {
            connect: newCards.map((m) => ({ id: m.id })),
          },
          spells: {
            connect: newSpells.map((m) => ({ id: m.id })),
          },
          orchestrions: {
            connect: newOrchestrions.map((m) => ({ id: m.id })),
          },
          mounts: {
            connect: newMounts.map((m) => ({ id: m.id })),
          },
        },
      });

      console.log(`Updated trial ${trial.name} with:
        ${newMinions.length} new minions
        ${newEmotes.length} new emotes
        ${newHairstyles.length} new hairstyles
        ${newCards.length} new cards
        ${newSpells.length} new spells
        ${newOrchestrions.length} new orchestrions
        ${newMounts.length} new mounts`);
    } else {
      console.log(`No new connections found for trial ${trial.name}`);
    }
  }
}