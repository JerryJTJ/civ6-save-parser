"use strict";

/* global describe, it -- Globals defined by Mocha */

import { readFileSync, readdirSync } from "fs";
import { expect } from "chai";
import { parse } from "../parse.js";

describe("Parse Cathy Save", () => {
	const files = [
		"test/saves/CATHERINE DE MEDICI 1 4000 BC.Civ6Save",
		"test/saves/CATHERINE DE MEDICI 1 4000 BC_AU.Civ6Save",
	];

	for (const file of files) {
		const buffer = Buffer.from(readFileSync(file));
		const parsed = parse(buffer).parsed;
		const parsedSimple = parse(buffer, { simple: true }).parsed;

		it("should have 4 civs", () => {
			expect(parsed.CIVS.length).to.equal(4);
			expect(parsedSimple.CIVS.length).to.equal(4);
		});

		it("should have 7 actors", () => {
			expect(parsed.ACTORS.length).to.equal(7);
			expect(parsedSimple.ACTORS.length).to.equal(7);
		});

		it("is game turn 1", () => {
			expect(parsed.GAME_TURN.data).to.equal(1);
			expect(parsedSimple.GAME_TURN).to.equal(1);
		});

		it("has correct game speed", () => {
			expect(parsed.GAME_SPEED.data).to.equal("GAMESPEED_ONLINE");
			expect(parsedSimple.GAME_SPEED).to.equal("GAMESPEED_ONLINE");
		});

		it("has correct map size", () => {
			expect(parsed.MAP_SIZE.data).to.equal("MAPSIZE_TINY");
			expect(parsedSimple.MAP_SIZE).to.equal("MAPSIZE_TINY");
		});

		it("has correct map file", () => {
			expect(parsed.MAP_FILE.data).to.equal("Pangaea.lua");
			expect(parsedSimple.MAP_FILE).to.equal("Pangaea.lua");
		});

		it("is player 1's turn", () => {
			expect(parsed.CIVS[0].IS_CURRENT_TURN.data).to.equal(true);
			expect(parsedSimple.CIVS[0].IS_CURRENT_TURN).to.equal(true);

			for (let i = 1; i < parsed.CIVS.length; i++) {
				expect(parsed.CIVS[i]).to.not.have.property("IS_CURRENT_TURN"); // AMBIGUOUS - in this case, the value does not exist at all in the file
				expect(parsedSimple.CIVS[i].IS_CURRENT_TURN).to.not.be.ok;
			}
		});

		it("should have civs in the correct order", () => {
			for (let i = 0; i < parsed.CIVS.length; i++) {
				expect(parsed.CIVS[i].PLAYER_NAME.data).to.equal(
					"Player " + (i + 1)
				);
				expect(parsedSimple.CIVS[i].PLAYER_NAME).to.equal(
					"Player " + (i + 1)
				);
			}
		});

		it("has all players alive", () => {
			for (let i = 0; i < parsed.CIVS.length; i++) {
				expect(parsed.CIVS[i].PLAYER_ALIVE.data).to.equal(true);
				expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(true);
			}
		});
	}
});

describe("Parse Hojo Save", () => {
	const buffer = Buffer.from(
		readFileSync("test/saves/HŌJŌ TOKIMUNE 341 1920 d. C..Civ6Save")
	);
	const parsed = parse(buffer).parsed;
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 6 civs", () => {
		expect(parsed.CIVS.length).to.equal(6);
		expect(parsedSimple.CIVS.length).to.equal(6);
	});

	it("has all players alive", () => {
		for (let i = 0; i < parsed.CIVS.length; i++) {
			expect(parsed.CIVS[i].PLAYER_ALIVE.data).to.equal(true);
			expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(true);
		}
	});
});

describe("Parse 144", () => {
	const buffer = Buffer.from(readFileSync("test/saves/000144.Civ6Save"));
	const parsed = parse(buffer).parsed;
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 4 civs", () => {
		expect(parsed.CIVS.length).to.equal(4);
		expect(parsedSimple.CIVS.length).to.equal(4);
	});

	it("should be player 3's turn", () => {
		expect(parsed.CIVS[2].IS_CURRENT_TURN.data).to.equal(true);
		expect(parsedSimple.CIVS[2].IS_CURRENT_TURN).to.equal(true);

		for (let i = 0; i < parsed.CIVS.length; i++) {
			if (i !== 2) {
				expect(parsed.CIVS[i].IS_CURRENT_TURN.data).to.equal(false); // AMBIGUOUS - in this case, the value exists in the file and is false
				expect(parsedSimple.CIVS[i].IS_CURRENT_TURN).to.not.be.ok;
			}
		}
	});

	it("has all players alive", () => {
		for (let i = 0; i < parsed.CIVS.length; i++) {
			expect(parsed.CIVS[i].PLAYER_ALIVE.data).to.equal(true);
			expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(true);
		}
	});
});

describe("Parse 203 Save", () => {
	const buffer = Buffer.from(readFileSync("test/saves/000203.Civ6Save"));
	const parsed = parse(buffer).parsed;
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 4 civs", () => {
		expect(parsed.CIVS.length).to.equal(4);
		expect(parsedSimple.CIVS.length).to.equal(4);
	});

	it("has all players alive", () => {
		for (let i = 0; i < parsed.CIVS.length; i++) {
			expect(parsed.CIVS[i].PLAYER_ALIVE.data).to.equal(true);
			expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(true);
		}
	});
});

describe("Parse 12 Peeps Save", () => {
	const buffer = Buffer.from(readFileSync("test/saves/12peeps.Civ6Save"));
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 12 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(12);
	});

	it("should have correct data for the 12 civs", () => {
		expect(parsedSimple.CIVS[0].ACTOR_NAME).to.equal("CIVILIZATION_FRANCE");
		expect(parsedSimple.CIVS[0].LEADER_NAME).to.equal(
			"LEADER_CATHERINE_DE_MEDICI"
		);

		expect(parsedSimple.CIVS[1].ACTOR_NAME).to.equal("CIVILIZATION_EGYPT");
		expect(parsedSimple.CIVS[1].LEADER_NAME).to.equal("LEADER_CLEOPATRA");

		expect(parsedSimple.CIVS[2].ACTOR_NAME).to.equal(
			"CIVILIZATION_GERMANY"
		);
		expect(parsedSimple.CIVS[2].LEADER_NAME).to.equal("LEADER_BARBAROSSA");

		expect(parsedSimple.CIVS[3].ACTOR_NAME).to.equal("CIVILIZATION_INDIA");
		expect(parsedSimple.CIVS[3].LEADER_NAME).to.equal("LEADER_GANDHI");

		expect(parsedSimple.CIVS[4].ACTOR_NAME).to.equal(
			"CIVILIZATION_SUMERIA"
		);
		expect(parsedSimple.CIVS[4].LEADER_NAME).to.equal("LEADER_GILGAMESH");

		expect(parsedSimple.CIVS[5].ACTOR_NAME).to.equal("CIVILIZATION_GREECE");
		expect(parsedSimple.CIVS[5].LEADER_NAME).to.equal("LEADER_GORGO");

		expect(parsedSimple.CIVS[6].ACTOR_NAME).to.equal("CIVILIZATION_NORWAY");
		expect(parsedSimple.CIVS[6].LEADER_NAME).to.equal("LEADER_HARDRADA");

		expect(parsedSimple.CIVS[7].ACTOR_NAME).to.equal("CIVILIZATION_JAPAN");
		expect(parsedSimple.CIVS[7].LEADER_NAME).to.equal("LEADER_HOJO");

		expect(parsedSimple.CIVS[8].ACTOR_NAME).to.equal("CIVILIZATION_AZTEC");
		expect(parsedSimple.CIVS[8].LEADER_NAME).to.equal("LEADER_MONTEZUMA");

		expect(parsedSimple.CIVS[9].ACTOR_NAME).to.equal("CIVILIZATION_KONGO");
		expect(parsedSimple.CIVS[9].LEADER_NAME).to.equal("LEADER_MVEMBA");

		expect(parsedSimple.CIVS[10].ACTOR_NAME).to.equal(
			"CIVILIZATION_BRAZIL"
		);
		expect(parsedSimple.CIVS[10].LEADER_NAME).to.equal("LEADER_PEDRO");

		expect(parsedSimple.CIVS[11].ACTOR_NAME).to.equal(
			"CIVILIZATION_GREECE"
		);
		expect(parsedSimple.CIVS[11].LEADER_NAME).to.equal("LEADER_PERICLES");
	});

	it("has all players alive", () => {
		for (let i = 0; i < parsedSimple.CIVS.length; i++) {
			expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(true);
		}
	});
});

describe("Parse User Marker Bug Save", () => {
	const buffer = Buffer.from(
		readFileSync("test/saves/UserMarkerBug.Civ6Save")
	);
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 6 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(6);
	});

	it("has all players alive", () => {
		for (let i = 0; i < parsedSimple.CIVS.length; i++) {
			expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(true);
		}
	});
});

describe("Parse another file that broke things", () => {
	const buffer = Buffer.from(readFileSync("test/saves/000002.Civ6Save"));
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 6 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(6);
	});

	it("has all players alive", () => {
		for (let i = 0; i < parsedSimple.CIVS.length; i++) {
			expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(true);
		}
	});
});

describe("charlie is dead", () => {
	const buffer = Buffer.from(
		readFileSync("test/saves/charlieisdead.Civ6Save")
	);
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 4 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(4);
	});

	it("says charlie is dead", () => {
		for (let i = 0; i < parsedSimple.CIVS.length; i++) {
			expect(parsedSimple.CIVS[i].PLAYER_ALIVE).to.equal(i > 0); // charlie is player 0
		}
	});
});

describe("Parse save with 3 byte string length", () => {
	const buffer = Buffer.from(readFileSync("test/saves/000377.Civ6Save"));
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 10 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(10);
	});
});

describe("Parse Outback Tycoon saves", () => {
	const files = [
		"test/saves/OutbackTycoon.Civ6Save",
		"test/saves/OutbackTycoon2.Civ6Save",
	];

	for (const file of files) {
		const buffer = Buffer.from(readFileSync(file));
		const parsedSimple = parse(buffer, { simple: true }).parsed;

		it(file + " should have 4 civs", () => {
			expect(parsedSimple.CIVS.length).to.equal(4);
		});
	}
});

describe("Parse save file with empty slots", () => {
	const buffer = Buffer.from(
		readFileSync("test/saves/emptycivslots.Civ6Save")
	);
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 4 civs (not 6!)", () => {
		expect(parsedSimple.CIVS.length).to.equal(4);
	});
});

describe("Parse file with string longer than null terminator", () => {
	const buffer = Buffer.from(
		readFileSync("test/saves/nullterminator.Civ6Save")
	);
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 6 civs and #3 should be victoria", () => {
		expect(parsedSimple.CIVS.length).to.equal(6);
		expect(parsedSimple.CIVS[2].LEADER_NAME).to.equal("LEADER_VICTORIA");
	});
});

describe("Test decompression", () => {
	it("should work with all save files", () => {
		for (const save of readdirSync("test/saves")) {
			const buffer = Buffer.from(readFileSync("test/saves/" + save));
			const parseFunc = () => parse(buffer, { outputCompressed: true });

			expect(parseFunc, save).to.not.throw();
		}
	});
});

describe("Apocalypse save", () => {
	const buffer = Buffer.from(readFileSync("test/saves/apocalypse.Civ6Save"));
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 4 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(4);
	});
});

describe("Save that was triggering compressed data read", () => {
	const buffer = Buffer.from(
		readFileSync("test/saves/JAYAVARMAN VII. 1 4000 v. Chr..Civ6Save")
	);
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 8 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(8);
	});
});

describe("ignores ACTOR_AI_HUMAN = 2", () => {
	const buffer = Buffer.from(readFileSync("test/saves/civtype2.Civ6Save"));
	const parsedSimple = parse(buffer, { simple: true }).parsed;

	it("should have 6 civs", () => {
		expect(parsedSimple.CIVS.length).to.equal(6);
	});
});
