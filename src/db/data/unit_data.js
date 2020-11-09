export default (() => {
  const c = (unit_id, unit_name, kana, rarity, move_speed, search_area_width, atk_type, normal_atk_cast_time, comment) =>
    ({ unit_id, unit_name, kana, rarity, move_speed, search_area_width, atk_type, normal_atk_cast_time, comment });
  return [
    c(100101, 'ヒヨリ', 'ひより', 1, 450, 200, 1, 2.295, '【物理】前衛で、敵前線を押し返す笑顔の元気娘。\n前衛に対して大ダメージを与えるユニオンバーストと、\n自身の攻撃力を強化するスキルを持つ攻撃役。'),
    c(100201, 'ユイ', 'ゆい', 1, 450, 800, 2, 2.27, '【魔法】最後衛から、味方の回復と補助を行う魔法士。\n打たれ弱いが高い魔法攻撃力を持ち、ランクを上げると\n攻撃も補助もバランスよくこなせるようになる。'),
    c(100301, 'レイ', 'れい', 1, 450, 250, 1, 1.965, '【物理】前衛で、一点突破で敵を討つ、孤高の剣士。\nユニオンバースト、スキル共に眼前の敵を倒す事に優れ、\n攻撃スキルやカウンターを駆使して前線を押し上げる。'),
    c(100401, 'ミソギ', 'みそぎ', 1, 450, 205, 1, 2.17, '【物理】最前衛で、敵の物理攻撃を邪魔するいたずら娘。\n目の前の敵を暗闇状態にし、命中率を大幅に下げるほか、\n敵一体の物理攻撃力を下げるスキルを持つ。'),
    c(100501, 'マツリ', 'まつり', 2, 450, 185, 1, 2.125, '【物理】前衛の、機敏な動きで敵をかき回す騎士見習い。\nユニオンバーストで相手の陣地の真ん中に飛び込み、\n自分の周囲を攻撃するスキルで相手を攻め立てる。'),
    c(100601, 'アカリ', 'あかり', 2, 450, 570, 2, 2.19, '【魔法】中衛で、魔法パーティの強化を担う、双子の妹。\n敵の魔法防御力を大幅に下げるスキルや、魔法攻撃力を\n上昇させ、回復効果を付与するユニオンバーストを使う。'),
    c(100701, 'ミヤコ', 'みやこ', 2, 450, 125, 1, 1.7, '【物理】最前衛で、ひたすら敵の攻撃を避ける幽霊少女。\nスキルで幽霊に変身することで敵の攻撃を躱し、\nユニオンバーストでは敵をプリンにして食べてしまう。'),
    c(100801, 'ユキ', 'ゆき', 2, 450, 805, 2, 2.07, '【魔法】後衛で物理パーティを補助する、歩く芸術作品。\n味方のユニオンバースト発動を早めるスキルのほか、\n暗闇状態にするスキルで敵の物理攻撃を封じる。'),
    c(100901, 'アンナ', 'あんな', 3, 450, 440, 2, 2.25, '【魔法】中衛から圧倒的な魔力で攻撃する、疾風の冥姫。\nユニオンバーストで敵全体に大ダメージを与えるが、\n高すぎる魔力の為、自分自身にも相応のリスクが生じる。'),
    c(101001, 'マホ', 'まほ', 3, 450, 795, 2, 2.27, '【魔法】後衛で味方のサポートを担当するメルヘン少女。\n味方全体を強化してＴＰを回復するユニオンバーストや、\nＨＰ回復、敵を暗闇にするスキルで戦況を好転させる。'),
    c(101101, 'リノ', 'りの', 3, 450, 700, 1, 1.97, '【物理】後衛から、矢の雨を降らせる妹系アーチャー。\nクリティカル率を高める重ね掛け可能なスキルを持ち、\nダメージ回数の多いユニオンバーストをより強力にする。'),
    c(101201, 'ハツネ', 'はつね', 3, 450, 755, 2, 2.07, '【魔法】後衛の、対物理パーティが得意な超能力ガール。\nスキルが物理攻撃の敵に対して真価を発揮するため、\n物理攻撃型の敵パーティを一網打尽にする。'),
    c(101301, 'ナナカ', 'ななか', 2, 450, 740, 2, 2.07, '【魔法】後衛から多彩な魔法を放つ、オタク魔法少女。\n体力が一番多い相手を狙うユニオンバーストやスキルは、\n敵のＨＰ状況により攻撃対象が変わる高威力の魔法攻撃。'),
    c(101401, 'カスミ', 'かすみ', 3, 450, 730, 2, 2.27, '【魔法】後衛で、相手の行動妨害に特化した名探偵。\n束縛や混乱を付与するスキルで相手の行動を妨害し、\n魔法防御力ダウンのフィールドを展開して王手をかける。'),
    c(101501, 'ミサト', 'みさと', 2, 450, 735, 2, 2.27, '【魔法】後衛で魔法キャラを支援する、みんなの先生。\nユニオンバーストのＨＰ回復＆魔防アップ、先頭キャラの\n継続ＨＰ回復スキルは、味方の耐久力を大幅に高める。'),
    c(101601, 'スズナ', 'すずな', 2, 450, 705, 1, 1.97, '【物理】後衛からクリティカル攻撃するカリスマモデル。\nダメージ2倍のクリティカルダメージは\nスキルによる攻撃力アップでさらに破壊力を増す。'),
    c(101701, 'カオリ', 'かおり', 2, 450, 145, 1, 2.17, '【物理】最前衛で、累積スキルでダメージを稼ぐ南国娘。\nスキル「精神統一」を発動すると、カオリが攻撃する度に\n敵に効果が累積し、次のダメージがどんどん増えていく。'),
    c(101801, 'イオ', 'いお', 3, 450, 715, 2, 2.6, '【魔法】後衛で、敵全体を誘惑するセクシー先生。\n敵のＴＰを奪うスキルでユニオンバースト発動を遅らせ、\n誘惑のユニオンバーストを放ち、戦場を大混乱に陥れる。'),
    c(102001, 'ミミ', 'みみ', 2, 450, 360, 1, 2.125, '【物理】中衛で、敵前衛を崩す、うさぎっこ。\nユニオンバーストは、最も近い敵に大ダメージを与えた後\n隣の敵にも攻撃するので、前衛を早期に攻め落とせる。'),
    c(102101, 'クルミ', 'くるみ', 1, 450, 240, 1, 1.675, '【物理】前衛で、味方の守りに特化した、極度の照れ屋。\nスキルで自分の周囲の物理、魔法防御力を上げつつ、\n近くの敵をスタンさせて足止めする。'),
    c(102201, 'ヨリ', 'より', 1, 450, 575, 2, 2.19, '【魔法】中衛から、強力な魔法で攻め立てる、双子の姉。\n自身のＨＰと引き換えに魔法攻撃力を増幅し、\nユニオンバーストやスキルの威力を高めて攻撃する。'),
    c(102301, 'アヤネ', 'あやね', 2, 450, 210, 1, 1.425, '【物理】前衛で、戦場をかき乱す、くまっ子。\nユニオンバーストで、相手を思い切り吹き飛ばすと同時に\nスタンと大ダメージを与えることで敵陣形を大きく乱す。'),
    c(102501, 'スズメ', 'すずめ', 1, 450, 720, 2, 2.27, '【魔法】後衛で、回復と攻撃をこなすドジっ娘メイド。\n周りの味方のＨＰを回復しつつ物理攻撃力を高める\nスキルは、中衛・後衛の攻撃役と抜群の相性。'),
    c(102601, 'リン', 'りん', 2, 450, 550, 1, 2.34, '【物理】中衛で物理パーティを強化するものぐさ少女。\n味方の物理攻撃力をアップしつつ、味方の魔法防御を\n高めることで攻守ともにパーティをサポートする。'),
    c(102701, 'エリコ', 'えりこ', 2, 450, 230, 1, 1.425, '【物理】前衛で、毒スキルで敵を粉砕する、通称壊し屋。\n最高クラスの攻撃力を持ち、ユニオンバーストで\n敵にとどめを刺す毎に、その攻撃力はさらにアップする。'),
    c(102801, 'サレン', 'されん', 3, 450, 430, 1, 2.09, '【物理】中衛で一発逆転を狙う、みんなのサレンママ。\nＨＰが下がるほどダメージが上昇するユニオンバーストと\n味方のＴＰを回復するスキルで、一気に形勢を逆転する。'),
    c(102901, 'ノゾミ', 'のぞみ', 3, 450, 160, 1, 1.965, '【物理】前衛で、皆の壁になって戦うアイドルのぞみん。\n彼女がステージに立てば、味方の物理攻撃力が\n大きくアップし、さらに敵の注意を一手に惹き付ける。'),
    c(103001, 'ニノン', 'にのん', 3, 450, 415, 1, 2.25, '【物理】中衛で、強力な範囲攻撃を操る、忍術の使い手。\n範囲攻撃のスキルで敵を倒す事で、自分のＴＰを回復し、\n強力なユニオンバーストの発動頻度を上げる。'),
    c(103101, 'シノブ', 'しのぶ', 2, 450, 365, 1, 2.25, '【物理】中衛で、父親のドクロを召喚して戦う霊能少女。\n召喚した父親は、自分とは別に攻撃を行ってくれるほか、\nダメージを代わりに受けてくれることもある。'),
    c(103201, 'アキノ', 'あきの', 3, 450, 180, 1, 2.125, '【物理】前衛で大暴れして攻める、令嬢剣士。\n自分の周りに、味方を回復するフィールドを作り出し、\n自ら前線を支え導く姿も、名家を背負う者のあるべき姿。'),
    c(103301, 'マヒル', 'まひる', 2, 450, 395, 1, 2.34, '【物理】中衛で、相手の動きを乱す牧場主。\n敵前衛をノックバックさせることで、隊列を崩し、\n他のキャラが使う範囲攻撃の対象に敵を押し込む。'),
    c(103401, 'ユカリ', 'ゆかり', 1, 450, 405, 1, 2.4, '【物理】中衛から、バリアや回復で味方を守る元聖騎士。\n傷ついた味方のＨＰやＴＰを回復するスキルを操り、\n打ち合いで消耗した所を、ピンポイントでサポートする。'),
    c(103601, 'キョウカ', 'きょうか', 3, 450, 810, 2, 2.07, '【魔法】後衛から強力な魔法で攻撃するちびっこ優等生。\nスキルで魔法攻撃力を瞬間的に高めた後に放つ\n「コスモブルーフラッシュ」は敵単体への威力抜群。'),
    c(103701, 'トモ', 'とも', 3, 450, 220, 1, 1.965, '【物理】前衛で、素早い斬撃を仕掛け敵を屠る剣術少女。\nユニオンバーストで自分の攻撃力と行動速度を上昇させ、\nほか攻撃スキルの殲滅能力を極限まで高め敵を圧倒する。'),
    c(103801, 'シオリ', 'しおり', 2, 450, 710, 1, 1.97, '【物理】最後衛から高火力スキルを連発するスナイパー。\nダメージを与えつつ、ＴＰを回復するスキルを持ち、\n強力な一撃のユニオンバーストを、素早く発動する。'),
    c(104001, 'アオイ', 'あおい', 1, 450, 785, 1, 1.97, '【物理】最後衛から状態異常の矢を放つ、ぼっちの射手。\nダメージと共に付与する毒や麻痺の追加効果により、\n防御力の高い敵であっても、確実にＨＰを削りとる。'),
    c(104201, 'チカ', 'ちか', 2, 450, 790, 2, 2.27, '【魔法】後衛から、前衛の戦いをサポートする唱喚士。\nユニオンバーストで、味方の回復と敵への攻撃を行う\n精霊を最前線に唱喚する。'),
    c(104301, 'マコト', 'まこと', 3, 450, 165, 1, 2.125, '【物理】前衛で、敵の防御力を削り取る、正義の獣人。\n敵の盾役の防御力を下げ、着実にダメージを与えることで\n早期に敵の守りを突破する。'),
    c(104401, 'イリヤ', 'いりや', 3, 450, 425, 2, 1.425, '【魔法】中衛で命を削り攻撃する「夜を統べる者」。\n自身のＨＰと引き換えに放つスキルは高い殲滅力を誇り\n範囲攻撃における威力では他の追随を許さない。'),
    c(104501, 'クウカ', 'くうか', 2, 450, 130, 1, 2.375, '【物理】前衛で囮となり、攻撃を引き付ける暴走ドＭ娘。\nユニオンバーストにより、自身に魔法バリアを張り、\n敵の魔法攻撃を吸収してＨＰを回復する。'),
    c(104601, 'タマキ', 'たまき', 2, 450, 215, 1, 2.25, '【物理】前衛の、対魔法パーティが得意な気まぐれ猫娘。\n攻撃スキルは、「魔法攻撃力が一番高い敵」を狙い撃ち、\nダメージ、魔法攻撃力ダウン、ＴＰ吸収と畳み掛ける。'),
    c(104701, 'ジュン', 'じゅん', 3, 450, 135, 1, 2.125, '【物理】最前衛で、完全防御スキルを操る騎士団長。\nユニオンバーストであらゆるダメージを吸収するバリアを\n展開できる。特に長期戦で圧倒的な防御性能を誇る。'),
    c(104801, 'ミフユ', 'みふゆ', 2, 450, 420, 1, 2.19, '【物理】中衛の、スタンと回復のスキルを持つ傭兵戦士。\n高い防御力と自己回復能力を併せ持つ事で、\n中衛の守りを堅固にし、パーティを底支えする。'),
    c(104901, 'シズル', 'しずる', 3, 450, 285, 1, 2.375, '【物理】前衛で、物理攻撃から味方を守る、お姉ちゃん。\nスキルで物理無効バリアを展開し、味方全員を守るほか、\n自身はさらに物理吸収バリアを纏い、敵前衛を討つ。'),
    c(105001, 'ミサキ', 'みさき', 1, 450, 760, 2, 2.07, '【魔法】後衛から、範囲攻撃を行う、レディ・ウィッチ。\n複数回の範囲攻撃を放つスキルや、目の前の敵全てを\n攻撃するユニオンバーストを持ち、範囲殲滅に特化する。'),
    c(105101, 'ミツキ', 'みつき', 2, 450, 565, 1, 2.25, '【物理】中衛で、敵弱体化フィールドを操る隻眼の悪魔。\nフィールドの持続時間は短いが、範囲内の敵の\n物理防御力を大幅に減らす効果を持つ。'),
    c(105201, 'リマ', 'りま', 1, 450, 105, 1, 2.215, '【物理】最前衛で味方を守る、恋する乙女。\nバトル開始後、しばらくしてから最前線まで\n突進してきて、敵の目の前に立ちはだかる。'),
    c(105301, 'モニカ', 'もにか', 3, 450, 410, 1, 2.24, '【物理】中衛で、味方の攻撃を鼓舞する、軍人娘。\n味方全体の物理、魔法攻撃力の大幅アップに加えて、\n攻撃速度もあげることで、戦闘の早期終結を実現する。'),
    c(105401, 'ツムギ', 'つむぎ', 2, 450, 195, 1, 2.42, '【物理】前衛で、敵の妨害に特化したテーラーガール。\n敵を強制的に移動させる事で陣形を崩し、さらに\n移動速度・行動速度を低下させ相手の反撃を遅らせる。'),
    c(105501, 'アユミ', 'あゆみ', 1, 450, 510, 1, 2.34, '【物理】中衛で、どたばたと敵をかく乱する、純情少女。\n敵をスタンさせるスキルのほか、ユニオンバーストでは\n暗闇と混乱を付与することで敵を邪魔することができる。'),
    c(105601, 'ルカ', 'るか', 3, 450, 158, 1, 1.965, '【物理】前衛で味方のため剣を振るう、いなせな姉御。\n相手へのカウンターも行う挑発や、敵の防御力を下げる\nユニオンバーストを持ち、攻防両面で実力を発揮する。'),
    c(105701, 'ジータ', 'じーた', 3, 450, 245, 1, 1.965, '【物理】前衛で、先手必勝の大技を繰り出す騎空士。\nスキルによるＴＰ回復は、ユニオンバーストの発動を早め\nバトルの序盤から敵前衛に大ダメージを与える。'),
    c(105801, 'ペコリーヌ', 'ぺこりーぬ', 1, 450, 155, 1, 2.25, '【物理】前衛にて、全力で仲間を護る、腹ペコ剣士。\n高いＨＰに加えて、自分自身でもＨＰ回復できるため\nギリギリまで味方の壁役を引き受ける。'),
    c(105901, 'コッコロ', 'こっころ', 1, 450, 500, 1, 2.34, '【物理】中衛で、補助と攻撃で皆を支える、導きの巫女。\nユニオンバーストは、味方全体の攻撃力アップに加えて\n自らも回復するため、継続的なサポートが可能となる。'),
    c(106001, 'キャル', 'きゃる', 1, 450, 750, 2, 2.07, '【魔法】後衛から、強力な全体攻撃を放つ、強気な猫娘。\nスキルで敵の物理、魔法両方の防御力を下げるため\n編成を選ばずにバトルを有利に進められる。'),
    c(106101, 'ムイミ', 'むいみ', 3, 450, 162, 1, 1.8, '【物理】前衛で、伝説の剣「天楼覇断剣」を振るう少女。\n小技を駆使する通常の戦闘スタイルから一転、ユニオン\nバースト後は「天楼覇断剣」を携え、敵を薙ぎ払う。'),
    c(106301, 'アリサ', 'ありさ', 3, 450, 625, 1, 1.97, '【物理】後衛の、長期戦に優れた、森の守護者見習い。\nＴＰ回復によるユニオンバーストの速攻が可能。さらに\n使用後はスキル効果が上昇するため高い殲滅力を誇る。'),
    c(106501, 'カヤ', 'かや', 3, 450, 168, 1, 2.17, '【物理】前衛で、敵を殴り倒す喧嘩屋ドラゴン族。\nスキルで自身の物理攻撃力を高め、全身全霊を懸け放つ\n初弾のユニオンバーストは、超大な破壊力を誇る。'),
    c(106601, 'イノリ', 'いのり', 3, 450, 197, 1, 1.55, '【物理】前衛で範囲攻撃が得意な口達者のドラゴン娘。\nユニオンバーストで範囲内の敵をまとめて吹き飛ばし、\n陣形を乱したところで、敵を一気に焼き尽くす。'),
    c(106701, 'ホマレ', 'ホマレ', 0, 0, 0, 0, 0.0, ''),
    c(106801, 'ラビリスタ', 'らびりすた', 3, 450, 560, 1, 1.55, '【物理】中衛で、万有を自在に創造する『迷宮女王』。\n七冠としての権能を解放するユニオンバーストで自身を\n極大に強化し比類ない攻撃能力で仇なす者を剿滅する。'),
    c(107001, 'ネネカ', 'ねねか', 3, 450, 660, 2, 2.0, '【魔法】後衛で、分身生成し敵を圧倒する『変貌大妃』。\n分身はネネカ自身と同じスキルをくり出し敵を攻撃する。\nその攻撃密度と制圧力の高さは他の追随を許さない。'),
    c(107101, 'クリスティーナ', 'くりすてぃーな', 3, 450, 290, 1, 2.0, '【物理】前衛で、絶対的な制圧力を誇る『誓約女君』。\n攻防一体かつ超大な破壊力を誇るユニオンバーストと、\nその発動を加速するＴＰ上昇アップスキルを併せ持つ。'),
    c(107501, 'ペコリーヌ（サマー）', 'ぺこりーぬ', 3, 450, 235, 1, 2.125, '【物理】前衛から強烈な範囲攻撃を放つ、渚のお姫様。\nかき氷を食べて物理攻撃力を一気に上昇させ、\nユニオンバーストを放つことで前方の敵を殲滅する。'),
    c(107601, 'コッコロ（サマー）', 'こっころ', 1, 450, 535, 1, 2.34, '【物理】中衛で、物理キャラの補助を行う癒しの巫女。\nＨＰが一番少ない味方単体への特大回復スキルを持ち、\n瀕死の味方ですら瞬時に治癒する。'),
    c(107701, 'スズメ（サマー）', 'すずめ', 3, 450, 775, 2, 2.07, '【魔法】後衛の防衛能力に秀でた、夏のドジっ娘メイド。\n味方全体に防御力アップと継続ＨＰ回復をかけ、\nさらに壁になるゴーレムを呼んで、戦線を支える。'),
    c(107801, 'キャル（サマー）', 'きゃる', 3, 450, 780, 2, 1.92, '【魔法】後衛から強力な単体攻撃を放つ真夏の猫娘。\nスキルで敵の魔法防御力を下げた上で、\n敵単体への魔法攻撃を繰り出し、大ダメージを与える。'),
    c(107901, 'タマキ（サマー）', 'たまき', 3, 450, 225, 1, 2.0, '【物理】前衛で連続攻撃を放つ、海辺の気まぐれ猫娘。\nランダムな相手への単体攻撃を計４度行う\nユニオンバーストは、対象がランダムだが威力は抜群。'),
    c(108001, 'ミフユ（サマー）', 'みふゆ', 1, 450, 495, 1, 2.19, '【物理】中衛で、攻撃と補助の両方をこなす海の傭兵。\nユニオンバーストの効果で味方全体の物理攻撃力を高め、\n物理攻撃パーティの能力アップに一役買う。'),
    c(108101, 'シノブ（ハロウィン）', 'しのぶ', 3, 450, 440, 1, 1.55, '【物理】中衛で、弱った敵を刈り取る幻夜の霊能少女。\n弱った敵単体に大ダメージを与えるユニオンバーストは\n対象を撃破時さらに敵全体に追加ダメージを与える。'),
    c(108201, 'ミヤコ（ハロウィン）', 'みやこ', 1, 450, 590, 1, 2.42, '【物理】中衛から、敵陣の後方を狙い撃つ幽霊狼少女。\n前方の相手を無視して妨害スキルやユニオンバーストを\n敵後方に放ち、特に防御力が低いキャラの脅威になる。'),
    c(108301, 'ミサキ（ハロウィン）', 'みさき', 3, 450, 815, 2, 2.07, '【魔法】後衛で、妨害スキルを操るオシャレ魔法少女。\n相手を誘惑状態にするスキルや、複数の状態異常を\n同時に付与するユニオンバーストで相手をかく乱する。'),
    c(108401, 'チカ（クリスマス）', 'ちか', 3, 450, 770, 2, 2.27, '【魔法】後衛で、精霊を唱喚して戦う雪華の歌姫。\nユニオンバーストで呼び出す精霊たちはＨＰやＴＰを\n回復する能力を持ち、不利な戦況をも一変させる。'),
    c(108501, 'クルミ（クリスマス）', 'くるみ', 1, 450, 295, 1, 1.55, '【物理】前衛から、ベルの音色で味方を守る小さな女優。\n攻撃を受けるまで周囲にいる味方の防御力を大きく高める\nスキルを持つ。活用できれば無類の耐久力を誇る。'),
    c(108601, 'アヤネ（クリスマス）', 'あやね', 3, 450, 190, 1, 1.425, '【物理】前衛で、敵をなぎ倒していく聖夜のくまっ子。\nユニオンバーストはＨＰを消費するが威力は絶大。\nスキルで物理攻撃力を上げ、さらにダメージアップ。'),
    c(108701, 'ヒヨリ（ニューイヤー）', 'ひより', 3, 450, 170, 1, 2.17, '【物理】前衛で、物理火力を担う、振り袖姿の元気娘。\n物理攻撃キャラの攻撃力を上昇させるスキルを使う。\nさらに高い威力の単体ユニオンバーストの攻撃力は随一。'),
    c(108801, 'ユイ（ニューイヤー）', 'ゆい', 3, 450, 745, 2, 2.27, '【魔法】後衛の、補助魔法に特化した、晴れ姿の癒し手。\n自身の攻撃力と引き換えに強力なバリアと継続回復状態を\n味方全体に付与する。絶大な防御能力は他を圧倒する。'),
    c(108901, 'レイ（ニューイヤー）', 'れい', 1, 450, 153, 1, 2.215, '【物理】前衛で、魔法攻撃から味方を守る、華麗な剣士。\nスキルで範囲内の味方に魔法無効バリアを展開し、\nさらにユニオンバーストで敵をスタンさせ攻撃を断つ。'),
    c(109001, 'エリコ（バレンタイン）', 'えりこ', 1, 450, 187, 1, 1.9, '【物理】前衛で、ピンチをチャンスに変える愛の壊し屋。\nスキルはＨＰを消費し、自身の攻撃力を高める。また、\nユニオンバーストはＨＰが低いほど超絶威力を発揮する。'),
    c(109101, 'シズル（バレンタイン）', 'しずる', 3, 450, 385, 1, 2.125, '【物理】中衛で皆を助けるパティシエールのお姉ちゃん。\n複数のパラメータが同時に上昇するフィールドを展開し、\nさらに効果時間中はスキル効果が大幅に強化される。'),
    c(109201, 'アン', 'あん', 3, 450, 630, 2, 2.27, '【魔法】後衛で、英霊の召喚術を武器に戦うお姫様。\n味方に英霊の加護を付与するスキルによるサポーターと、\n高威力の魔法によるアタッカーの二つの役割を併せ持つ。'),
    c(109301, 'ルゥ', 'るぅ', 1, 450, 640, 2, 2.27, '【魔法】後衛で、オメメちゃんと戦う、ノーテンキ少女。\nスキルで呼び出すオメメちゃんは敵の攻撃を防ぐほか、\nその数が多いほどユニオンバーストの威力を増加させる。'),
    c(109401, 'グレア', 'ぐれあ', 3, 450, 525, 2, 2.27, '【魔法】中衛で、炎を操り敵を薙ぎ払う、竜人の少女。\n高い魔法攻撃力を生かした範囲攻撃を得意とする。\nまた、飛行能力を駆使して放つ突進攻撃も強力。'),
    c(109501, 'クウカ（オーエド）', 'くうか', 3, 450, 140, 2, 2.066, '【魔法】最前衛で、味方を鼓舞する着物姿のドＭ娘。\n味方の魔法攻撃力を高め、敵の魔法防御力を下げる事で、\n魔法パーティのサポート兼防御役として活躍する。'),
    c(109601, 'ニノン（オーエド）', 'にのん', 3, 450, 175, 1, 2.0, '【物理】最前衛で、忍法を駆使して敵と戦うクノイチ。\nユニオンバーストはクリティカル時のダメージを１．５倍\nにする特性を持ち、うまくかみ合った時の威力は抜群。'),
    c(109701, 'レム', 'れむ', 3, 450, 540, 1, 2.25, '【物理】中衛で、鬼の力で敵を粉砕する、双子の妹。\n回復スキルの他にも、温度を操るスキルを得意とし、\n敵を凍結させた上でユニオンバーストで薙ぎ払う。'),
    c(109801, 'ラム', 'らむ', 1, 450, 545, 2, 2.5, '【魔法】中衛で、特殊能力で味方を補助する、双子の姉。\n相手の物理攻撃を見切って回避させる「千里眼」や、\n敵全体を束縛するユニオンバーストの補助は効果絶大。'),
    c(109901, 'エミリア', 'えみりあ', 3, 450, 725, 2, 2.27, '【魔法】後衛で、攻撃と回復をこなす、ハーフエルフ。\n高い魔力で攻撃魔法を繰り出して敵を蹴散らしつつ、\nユニオンバーストは瀕死の味方すらも瞬時に癒す。'),
    c(110001, 'スズナ（サマー）', 'すずな', 3, 450, 705, 1, 1.82, '【物理】後衛で高威力の弓技を放つ夏のカリスマモデル。\nバトル中に一度だけ放つ「サマーランウェイ♪」でＴＰを\n全回復し、以降ユニオンバーストがクリティカルになる。'),
    c(110101, 'イオ（サマー）', 'いお', 1, 450, 715, 2, 2.4, '【魔法】後衛で、敵の体力を奪い取る、夏の夜の先生。\nダメージを与えつつ味方を回復するスキルを複数持ち、\n攻守どちらの側でも高い能力を発揮する。'),
    c(110201, 'ミサキ（サマー）', 'みさき', 1, 0, 0, 0, 0.0, ''),
    c(110301, 'サレン（サマー）', 'されん', 3, 450, 585, 1, 2.24, '【物理】中衛で、味方の速攻を支える海辺のサレンママ。\nバトル開始時に味方全体のＴＰを一気に溜めることで、\n迅速にユニオンバーストを発動させることを可能にする。'),
    c(110401, 'マコト（サマー）', 'まこと', 3, 450, 180, 1, 2.125, '【物理】前衛で攻撃対象が１つの敵に特化した海の狼娘。\n攻撃対象が１つの場合、スキルとユニオンバーストともに\n真価を発揮し他を圧倒する絶大な破壊力で敵をなぎ払う。'),
    c(110501, 'カオリ（サマー）', 'かおり', 1, 450, 425, 1, 2.42, '【物理】中衛で、敵をまとめてなぎ倒す、真夏の南国娘。\n吹き飛ばし効果を持つスキルで敵をまとめ、攻撃対象が\n多い程、威力が増すユニオンバーストで敵をなぎ倒す。'),
    c(110601, 'マホ（サマー）', 'まほ', 3, 450, 792, 2, 2.27, '【魔法】後衛で、膨大な魔力を振るう、真夏のおとぎ姫。\n高火力で対象がランダムなスキルやユニオンバーストは、\n攻撃対象が１つの敵に対して絶大なダメージを叩き出す。'),
    c(110701, 'アオイ（編入生）', 'あおい', 3, 450, 680, 1, 1.82, '【物理】後衛で毒を操る、ぼっちエルフの編入生。\n敵が毒や猛毒になっていると強化される攻撃スキルと、\n敵の物理防御力を下げるスキルで味方をサポートする。'),
    c(110801, 'クロエ', 'くろえ', 3, 450, 185, 1, 2.125, '【物理】前衛で、手数で圧倒する、ダウナー系エルフ。\n攻撃するたびに相手に【畏縮】ステータスを追加し、\nスキルのダメージと物理防御力ダウンに磨きをかける。'),
    c(110901, 'チエル', 'ちえる', 3, 450, 222, 1, 2.295, '【物理】前衛でパンチを放つちぇる盛りＭＡＸな女の子。\nクリティカルを出すたびに【ちぇる】を溜め、自己を強化\nし続け、後半になるほど敵をちぇるっとじぇのさいする。'),
    c(111001, 'ユニ', 'ゆに', 3, 450, 807, 2, 2.27, '【魔法】後衛で、味方の支援に特化した象牙の塔の才媛。\n自身の攻撃力は低いが、物理攻撃力の高い味方を強化し\n更に味方全体を魔法無効バリアで護りつつ勝利へ導く。'),
    c(111101, 'キョウカ（ハロウィン）', 'きょうか', 3, 450, 820, 2, 2.07, '【魔法】後衛で味方の火力を高める、黒猫仮装の優等生。\n自分の魔法攻撃力に応じて効果が強化されるものと、\n効果が累積するもの等、多彩なスキルで攻撃力を高める。'),
    c(111201, 'ミソギ（ハロウィン）', 'みそぎ', 1, 450, 212, 1, 2.17, '【物理】前衛で範囲攻撃を放つ、カボチャ衣装の悪戯娘。敵に５カウントで爆発する爆弾を仕掛けたり、カボチャの手榴弾を投げつけたりと、様々な範囲攻撃で敵を弄ぶ。'),
    c(111301, 'ミミ（ハロウィン）', 'みみ', 3, 450, 365, 1, 2.0, '【物理】中衛の、攻撃に特化した、ぐるぐるうさぎっこ。\n行動頻度は少ないが、高威力の範囲攻撃を放ち、\n味方全体の物理攻撃力を大きく高めるスキルも効果抜群。'),
    c(111401, 'ルナ', 'るな', 3, 450, 765, 2, 1.87, '【魔法】後衛で、死霊術でおともだちを作る可憐な少女。\nルナがダメージを与える度に集まってくるおともだちを、\n各スキルで消費する。消費数に応じ強大な力を発揮する。'),
    c(111501, 'クリスティーナ（クリスマス）', 'くりすてぃーな', 3, 450, 265, 1, 2.0, '【物理】前衛で戦いを愉しむ、聖夜の『誓約女君』。\nユニオンバーストを使用すると得られるコインの有無で、\n補助と攻撃の二役を切り替え、華麗に敵を斬り倒す。'),
    c(111601, 'ノゾミ（クリスマス）', 'のぞみ', 1, 450, 418, 1, 2.24, '【物理】中衛でパーティの守りを支えるサンタアイドル。\nスキルで物理攻撃を無効化し、後方の味方が多いほど\n物理防御力を高めるユニオンバーストで生存力を高める。'),
    c(111701, 'イリヤ（クリスマス）', 'いりや', 3, 450, 255, 2, 1.3, '【魔法】前衛で、血を対価に敵を攻撃する聖夜の吸血鬼。\n残りＨＰが低い程ダメージが上昇するスキルと、ＨＰを\n消費するスキルを組み合わせ、絶大な破壊力を発揮する。'),
    c(111801, 'ペコリーヌ（ニューイヤー）', 'ぺこりーぬ', 0, 0, 0, 0, 0.0, ''),
    c(111901, 'コッコロ（ニューイヤー）', 'こっころ', 3, 450, 159, 1, 1.87, '【物理】前衛で、味方の補助に秀でた、新風の巫女。\n物理クリティカル時のダメージアップのスキルで味方の\n殲滅力を高めつつ、挑発や継続回復で耐久面を支える。'),
    c(112001, 'キャル（ニューイヤー）', 'きゃる', 3, 450, 690, 2, 2.07, '【魔法】後衛で、攻防双方で活躍する晴れ着姿の猫娘。\n与ダメージに応じて魔法攻撃力がアップするユニオン\nバーストで、高いベースの攻撃力がさらに強大になる。'),
    c(112101, 'スズメ（ニューイヤー）', 'すずめ', 1, 450, 722, 2, 2.27, '【魔法】後衛で祈りによるサポートを行うドジっ娘巫女。\nスキルの魔法無効バリアで耐久力を高め、ユニオン\nバーストでＨＰ回復と行動速度アップで戦況を整える。'),
    c(112201, 'カスミ（マジカル）', 'かすみ', 3, 450, 730, 2, 2.27, '【魔法】後衛の、妨害に特化した能力を持つ魔法探偵。\n相手のＴＰを大きく減少させるスキルや、遠くの敵を\n束縛するスキルを操り、相手の連携を大きく乱す。'),
    c(112301, 'シオリ（マジカル）', 'しおり', 1, 450, 712, 1, 1.97, '【物理】後衛で味方の火力の底上げを担う魔法狩人。\nユニオンバーストで味方全体の物理攻撃力を大きく高め\nスキルは範囲内の物理攻撃力を高め、輝矢の一撃を放つ。'),
    c(112401, 'ウヅキ（デレマス）', 'うづき', 3, 450, 370, 1, 2.24, '【物理】中衛で、味方を鼓舞して戦う、キュートな少女。\n味方をＴＰや攻撃力をアップさせるスキルでサポートし、\n自身も強力な範囲攻撃で敵をなぎ払う。'),
    c(112501, 'リン（デレマス）', 'りんでれます', 3, 450, 153, 1, 2.215, '【物理】前衛で、氷を創出し味方を護る、クールな少女。\n目の前の敵を束縛するスキルや挑発で行動を妨害し、\n自身にもバリアを展開し、鉄壁の防御能力を発揮する。'),
    c(112601, 'ミオ（デレマス）', 'みお', 1, 450, 695, 2, 2.27, '【魔法】後衛で攻防共に活躍するパッション溢れる少女。\nダメージを受けた味方中心に回復魔法で補助をし、\nさらに魔法攻撃を仕掛けて、敵を一網打尽にする。'),
    c(112701, 'リン（レンジャー）', 'りん', 3, 450, 422, 1, 2.19, '【物理】中衛から、敵の守りを貫くドングリレンジャー。\n戦闘開始と共に範囲内の敵の物理防御力を大幅に下げ、\n序盤から大ダメージを与えられる戦況を作り出す。'),
    c(112801, 'マヒル（レンジャー）', 'まひる', 3, 450, 390, 1, 2.19, '【物理】中衛で、多勢相手が十八番のまきばの戦士。\n相手を吹き飛ばすスキルを多用し敵の陣形を押し込む。\n範囲攻撃と混乱付与スキルを駆使し一気に殲滅する。'),
    c(112901, 'リノ（ワンダー）', 'りの', 3, 450, 730, 1, 1.97, '【物理】後衛で、希望の力で戦う、不思議の国の救世主。\nクリティカルすると効果アップのスキルや味方の数が多い\n程、威力がアップするユニオンバーストで敵を殲滅する。'),
    c(113001, 'アユミ（ワンダー）', 'あゆみ', 1, 450, 508, 1, 2.34, '【物理】中衛で、戦場の動向を自在に操る白兎の乙女。\n敵の行動速度をダウンさせ、味方の速度をアップさせる\nスキルと敵の時を止めるスキルで、常に味方を支える。'),
    c(113101, 'ルカ（サマー）', 'るか', 3, 450, 192, 1, 1.3, '【物理】前衛で、流麗な太刀捌きを魅せる若夏の姉御。\nダメージを与えた回数に応じて攻撃力が高まるスキルと、\n携えた二刀の幾刃もの斬撃で、眼前の敵を薙ぎ払う。'),
    c(113201, 'アンナ（サマー）', 'あんな', 1, 450, 256, 2, 1.625, '【魔法】前衛で皆の力を借り受け力を振るう真夏の冥姫。\n味方全体の魔法攻撃力を代償に自身の魔法攻撃力を劇的に\n高め、熾烈な攻撃魔法を繰り出し大ダメージを与える。'),
    c(113301, 'ナナカ（サマー）', 'ななか', 3, 450, 468, 2, 2.07, '【魔法】中衛の多勢相手の戦いが得意な真夏の魔法少女。\n敵の数に応じて効果が上昇する防御力ダウンのスキルや、\n多彩な範囲攻撃を操り、真夏の戦いをサイカワに制する。'),
    c(113401, 'ハツネ（サマー）', 'はつね', 3, 450, 567, 2, 1.92, '【魔法】中衛から全体魔法攻撃を放つ超能力チアガール。\nユニオンバーストで敵全体に絶大な一撃を放ち、\nその後、超能力発動の反動で枕を抱えて夢の中へ。'),
    c(113501, 'ミサト（サマー）', 'みさと', 1, 450, 697, 2, 2.07, '【魔法】後衛で、敵の脅威から生徒を守る夏女神な先生。\n味方の魔法防御力を高め、ＨＰを継続回復するスキルや、\nバリア展開のユニオンバーストで味方を堅固に守護する。'),
    c(113601, 'ジュン（サマー）', 'じゅん', 3, 450, 182, 1, 2.0, '【物理】前衛で、業火を従え悪を討つ真夏の騎士団長。\n敵単体にダメージを与えつつ、攻撃力を高めるユニオン\nバーストや、火傷を与えるスキルを操り敵を焼き尽くす。'),
    c(113701, 'アカリ（エンジェル）', 'あかり', 3, 450, 530, 2, 1.92, '【魔法】中衛で、魔法攻撃をお見舞いする双子の妹天使。\n効果時間が短い分、絶大な効果の強化魔法で自身の攻撃力\nを大きく高め、威力抜群の単体魔法で敵を一掃する。'),
    c(113801, 'ヨリ（エンジェル）', 'より', 3, 450, 531, 2, 2.34, '【魔法】中衛で、補助魔法で味方を助ける双子の姉天使。\n防御力を大幅に高めつつ、対象の味方に敵の注意を引か\nせるなど、特殊で強力なスキルを駆使し敵を翻弄する。'),
    c(113901, 'ツムギ（ハロウィン）', 'つむぎ', 3, 450, 152, 1, 2.375, '【物理】前衛で敵の物理攻撃を妨害する吸血鬼テーラー。\n挑発と物理無効バリア、さらに最も物理攻撃力が高い敵を\n狙った妨害スキルによって、鉄壁の防御を織り上げる。'),
    c(114001, 'レイ（ハロウィン）', 'れい', 3, 450, 375, 1, 1.965, '【物理】中衛で、手負いの敵を死に誘う、幽雅の剣士。\nＨＰが50％未満の敵に対し放つと、威力が大アップする\n範囲攻撃を繰り出し負傷した敵の戦意を一気に叩き折る。'),
    c(114101, 'マツリ（ハロウィン）', 'まつり', 1, 450, 186, 1, 2.295, '【物理】前衛で鋭爪を突き立てるハロウィン騎士見習い。\nユニオンバーストの使用回数に応じて強化されるスキルで\n与えるダメージと行動速度をアップさせ、敵を斬り裂く。'),
    c(114201, 'モニカ（マジカル）', 'もにか', 3, 450, 528, 1, 2.24, '【物理】中衛で愛と希望の力を胸に指揮を執る魔法提督。\nユニオンバーストで敵単体の物理防御力を下げ、範囲内の\n味方の物理攻撃力アップスキルで、一気に戦況を決める。'),
    c(114301, 'トモ（マジカル）', 'とも', 1, 0, 0, 0, 0.0, ''),
    c(180201, 'ユイ（プリンセス）', 'ゆい', 3, 450, 767, 2, 1.92, '【魔法】後衛から極大魔法で敵を滅する願いの魔法士。\nＴＰを回復しつつ攻撃力を累積アップする補助スキルで\n自身の力を高め、強力な範囲攻撃を放ち敵を一掃する。'),
    c(180401, 'ペコリーヌ（プリンセス）', 'ぺこりーぬ', 3, 450, 155, 1, 1.965, '【物理】前衛で、攻防共に絶大な力を誇る腹ペコ王女。\nＨＰが多い時は爆発的な攻撃力で、いかなる敵をも屠り、\nＨＰが減ると自己回復能力を得て、鉄壁の護りを見せる。'),
    c(180501, 'コッコロ（プリンセス）', 'こっころ', 3, 450, 555, 1, 2.14, '【物理】中衛で、絶大な補助スキルを繰出す純白の巫女。\n味方の攻撃力とクリティカルダメージを強化しつつ、\n二つの全体回復スキルで味方を堅固に守護し勝利へ導く。'),
    c(190801, 'カリン', 'かりん', 1, 0, 0, 1, 0.0, ''),
    c(191201, 'ペテルギウス', 'ぺてるぎうす', 1, 0, 0, 1, 0.0, ''),
    c(403101, '髑髏', 'どくろ', 1, 450, 300, 1, 2.0, ''),
    c(404201, 'シルフ', 'しるふ', 1, 450, 1000, 2, 2.0, ''),
    c(407001, 'ネネカ', 'ねねか', 3, 450, 460, 2, 2.0, ''),
    c(407701, 'ぷちゴーレム', 'ぷちごーれむ', 1, 450, 95, 1, 3.0, ''),
    c(408401, 'シルフ', 'しるふ', 1, 450, 700, 2, 2.0, ''),
    c(408402, 'シルフ', 'しるふ', 1, 450, 750, 2, 2.0, ''),
    c(408403, 'シルフ', 'しるふ', 1, 450, 800, 2, 2.0, ''),
    c(900001, '主人公', 'しゅじんこう', 1, 600, 475, 1, 50.0, ''),
    c(900002, '主人公', 'しゅじんこう', 1, 600, 600, 1, 3.0, ''),
    c(900003, '主人公', 'しゅじんこう', 1, 600, 650, 1, 3.0, ''),
    c(900102, 'ヒヨリ', 'ひより', 1, 600, 675, 1, 50.0, ''),
    c(900103, 'ヒヨリ', 'ひより', 1, 0, 0, 0, 0.0, ''),
    c(900201, 'ユイ', 'ゆい', 1, 600, 800, 2, 0.0, ''),
    c(900202, 'ユイ', 'ゆい', 1, 600, 1075, 2, 50.0, ''),
    c(900302, 'レイ', 'れい', 1, 600, 875, 1, 50.0, ''),
    c(900401, 'ミソギ', 'ミソギ', 1, 450, 580, 1, 2.17, ''),
    c(901001, 'マホ', 'まほ', 3, 450, 650, 2, 2.27, ''),
    c(901201, 'ハツネ', 'はつね', 1, 600, 755, 2, 50.0, ''),
    c(901701, 'カオリ', 'かおり', 2, 450, 300, 1, 2.17, ''),
    c(902501, 'スズメ', 'すずめ', 1, 600, 450, 2, 2.25, ''),
    c(902601, 'リン', 'りん', 1, 450, 630, 1, 2.315, ''),
    c(903601, 'キョウカ', 'きょうか', 3, 450, 890, 2, 50.0, ''),
    c(903801, 'シオリ', 'しおり', 1, 450, 710, 1, 50.0, ''),
    c(904401, 'イリヤ', 'いりや', 3, 450, 900, 2, 1.425, ''),
    c(905012, 'ミサキ（サマー）', 'みさき', 1, 450, 760, 2, 2.07, ''),
    c(905801, 'ペコリーヌ', 'ぺこりーぬ', 1, 600, 200, 1, 2.5, ''),
    c(905901, 'コッコロ', 'こっころ', 1, 600, 400, 1, 2.0, ''),
    c(905902, 'コッコロ', 'こっころ', 1, 600, 800, 1, 2.0, ''),
    c(906601, 'イノリ', 'いのり', 1, 0, 0, 0, 0.0, ''),
    c(907501, 'ペコリーヌ', 'ぺこりーぬ', 1, 600, 200, 1, 2.5, ''),
    c(907701, 'スズメ', 'すずめ', 1, 600, 450, 2, 2.25, ''),
    c(907801, 'キャル', 'きゃる', 1, 450, 750, 2, 2.07, ''),
    c(907901, 'タマキ', 'たまき', 1, 600, 250, 1, 2.25, ''),
    c(908701, 'ヒヨリ（ニューイヤー）', 'ひより', 1, 600, 0, 1, 0.0, '')
  ];
})();