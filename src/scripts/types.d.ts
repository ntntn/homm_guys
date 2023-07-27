type ChubrikConfig = {
    type: ChubrikType
    life: number,
    attack: number,
    speed: number,
    range: number,
    defense: number,
    price: number5
}

type ChubrikType =
    "fire_chubrik" |
    "water_chubrik" |
    "dragon" |
    "air_chubrik" |
    "chertik" |
    "skeleton" |
    "water_dragon" |
    "air_bird" |
    "earth_chubrik" |
    "earth_bender" |
    "air_mage";

type Position = { x: number, y: number }