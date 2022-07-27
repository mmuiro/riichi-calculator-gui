const ConditionsOptions: { [k: string]: string[][] } = {
    roundWind: [
        ["E", "S", "W", "N"],
        ["東", "南", "西", "北"],
    ],
    seatWind: [
        ["E", "S", "W", "N"],
        ["東", "南", "西", "北"],
    ],
    riichi: [
        ["Off", "Riichi", "Double Riichi"],
        ["なし", "立直", "ダブル立直"],
    ],
    agari: [
        ["Tsumo", "Ron"],
        ["自摸", "ロン"],
    ],
    ippatsu: [
        ["Off", "Ippatsu"],
        ["なし", "一発"],
    ],
    rinshan_chankan: [
        ["Off", "Rinshan/Chankan"],
        ["なし", "嶺上開花・槍槓"],
    ],
    houtei_haitei: [
        ["Off", "Houtei/Haitei"],
        ["なし", "河底・海底"],
    ],
    blessings: [
        ["Off", "Tenhou/Chiihou"],
        ["なし", "天和・地和"],
    ],
};

export default ConditionsOptions;
