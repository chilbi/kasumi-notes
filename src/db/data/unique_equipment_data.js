export default (() => {
  const c = (equipment_id, equipment_name, description, hp, atk, magic_str, def, magic_def, physical_critical, magic_critical, wave_hp_recovery, wave_energy_recovery, dodge, physical_penetrate, magic_penetrate, life_steal, hp_recovery_rate, energy_recovery_rate, energy_reduce_rate, enable_donation, accuracy) =>
    ({ equipment_id, equipment_name, description, hp, atk, magic_str, def, magic_def, physical_critical, magic_critical, wave_hp_recovery, wave_energy_recovery, dodge, physical_penetrate, magic_penetrate, life_steal, hp_recovery_rate, energy_recovery_rate, energy_reduce_rate, enable_donation, accuracy });
  return [
    c(130011, 'ニャンピオンベルト', 'ヒヨリが着用するベルト。\n雄々しき獣が睨みを利かせたバック\nルは、闘争本能を鼓舞し、その拳に\n更なる力を与える。', 0.0, 94.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130021, 'ブロッサムウィッシュ', 'ユイが着用しているカチューシャ。\n可愛らしく施されている花のレース\nと飾りは、仲間を守るための癒しの\n力を高めてくれる。', 0.0, 0.0, 46.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130031, 'ゲイルグローブ', 'レイが愛用しているグローブ。この\n攻守一体のグローブからくり出され\nる一突きは、立ちはだかるどんな敵\nをも貫く。', 110.0, 95.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130041, 'トリックギフト', 'ミソギが最高傑作と自負するいたず\nらボックス。子供の遊びと侮ること\nなかれ、外見のインパクトと衝撃音\nで敵の度肝を抜くこと間違いなし。', 0.0, 67.0, 0.0, 6.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130051, 'ジャスティスメダル', 'マツリが大切にしている、騎士団か\nら贈られた勲章。輝くメダルを見る\n度マツリの正義の心は強くなり、い\nかなる悪にも立ち向かう。', 130.0, 0.0, 0.0, 9.0, 8.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130061, 'デモンズトライデント', 'アカリの愛を一身に受けた魔槍。武\n器に秘められた強大な魔力は、小悪\n魔を刺激的な魔女へと、華麗に変貌\nさせる。', 0.0, 0.0, 72.0, 3.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130071, '霊甘ゴーストプリン', 'ミヤコ最愛の巨大にして、素材の一\nつ一つを丁寧にこだわり抜いた究極\nのプリン。至高の域に至る美味しさ\nは、思わず体が透けてしまうほど。', 230.0, 0.0, 0.0, 9.0, 3.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130081, 'グリッターコンパクト', 'ユキが愛用しているコンパクト。\n眩い光を放つ装飾がユキの輝きを引\nき立て、全人類に多大な影響を与え\nるという。', 0.0, 0.0, 63.0, 4.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130091, '螺旋霊撃疾風飛剣', '疾風の冥姫が操りし魔装。凡俗では\n瞬く間に魔に呑まれ廃人となる。\n禍々しき宵闇色の刃が艶めく刹那、\n闇は疾風となり愚者を奈落へ誘う。', 0.0, 0.0, 90.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130101, 'ピュアメルヘンワンド', '可愛らしくも絢爛な魔法杖。振れば\n支援の魔法と共にメルヘンチックな\n風が舞い、マホマホ王国の加護が付\n与される。', 0.0, 0.0, 42.0, 6.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130111, 'プロミネンスアロー', '鮮烈な炎を宿すリノ専用の魔法矢。\n情熱的な想いが炎の源となっており\nその一撃は、戦闘を決定づける高威\n力を誇る。', 0.0, 92.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130121, 'ミーティア☆リボン', 'シオリからハツネへと贈られた妹お\n手製のリボン。綺羅星に込められた\nシオリの想いが姉の魔力と呼応して\n敵の魔法防御力を低下させる。', 0.0, 0.0, 88.0, 1.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130131, 'ナナカサイツヨロッド', 'ナナカが振るう魔法の杖。\n天才魔法少女の電脳に閃光が走り、\n昂ぶった魔力を込めた超絶魔法で、\n敵を撃つことが出来るのだ！', 0.0, 0.0, 90.0, 0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130141, 'ディテクティブルーペ', 'カスミが愛用する探偵道具の一つ。\n数々の事件を共に解決してきたこの\n虫眼鏡は、どんな些細な事象も\n見逃さず、相手の退路を断つ。', 0.0, 0.0, 70.0, 3.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130151, 'アガペーヴェール', 'ミサトが着用しているヴェール。\n清らかなヴェールから溢れ出るミサ\nトの慈愛が皆の精神を高揚させ、魔\n法クリティカルをアップさせる。', 0.0, 0.0, 51.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0, 0.0),
    c(130161, 'クリティカルキス', 'スズナのとっておきのルージュ。そ\nの鮮やかな赤色は可憐さと妖艶さを\n併せ持ち、これを塗った唇からは何\n人たりとも目が離せない。', 0.0, 98.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(130171, '球陽唐手秘伝ノ書', 'カオリが使う琉球空手の奥義が記さ\nれた巻物。特殊な術式により、達人\nの練気にのみ反応して文字が浮かび\nあがるという。', 0.0, 94.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130181, 'グラマーウィップ', 'イオが教鞭として使っているムチ。\nどんなに味気ない勉学も、イオの手\nに掛かれば、甘いひと時に様変わり\nしてしまう。', 0.0, 0.0, 85.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(130201, 'うさぎさんブレード', 'ミミが愛用している剣。\nその可愛らしさに夢中になったミミ\nが振り回せば、見た目に反した攻撃\n範囲で敵を痛い目に遭わせる。', 0.0, 88.0, 0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 3.0),
    c(130211, 'ピュアアクトベル', 'クルミがお守りにしているベル。\n荘厳な見た目から奏でられる可愛ら\nしい音色が、怯える心に勇気を与え\nてくれる。', 100.0, 0.0, 0.0, 8.0, 8.0, 0.0, 0.0, 200.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130221, 'デモンズジャベリン', 'ヨリの魔力を増幅することに特化さ\nれた魔槍。生命力と引き換えに得る\n魔力は、一振りで周囲を灰燼と化す\nほどのもの。', 0.0, 0.0, 85.0, 0.0, 1.0, 0.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130231, '偉大なクマ王ぷうきち', '言わずと知れたアヤネの相棒がパワ\nーアップした姿。大いなる力を得た\nぷうきちの攻撃は敵の意識を長時間\n奪うことができる。', 0.0, 50.0, 0.0, 6.0, 4.0, 12.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130251, 'ロイヤルメイドドレス', 'ご奉仕の心を体現したエプロンドレ\nス。エプロンから溢れるサレンへの\n忠誠心がスズメの魔力を高め、敵の\n物理防御力を下げる。', 0.0, 0.0, 96.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130261, 'ジュエリズムドングリ', '膨大な魔力を内包する伝説のドング\nリが装飾された首飾り。リンの放つ\n魔法を増幅し、周囲の味方を大きく\n力づける。', 0.0, 60.0, 0.0, 2.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0, 0.0),
    c(130271, 'ノーマーシー', '過激な愛情を破壊力へと変転させる\nエリコ最狂の愛を錬成する霊斧。\n一閃するたびに破滅への狂想曲が奏\nでられる。', 0.0, 85.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(130281, 'グロリアスフェザー', 'サレン愛用のヘアアクセサリー。\n優しさの中に秘めた強さが象徴され\nている。その翼が羽ばたくとき、\n体は重力から解き放たれる。', 25.0, 105.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130291, 'ブリリアントマイク', 'ノゾミ専用のハンドマイク。可愛ら\nしいリボンの中心には【カルミナ】\nのマークが描かれている。これを手\nにトップアイドルを目指す。', 300.0, 0.0, 0.0, 6.0, 6.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130301, '紅蓮爆炎扇', 'ニノンが愛用する軍配。\n赤く染まった軍配が巻き起こす風は\n爆炎をまとい、立ち塞がるすべてを\n焼き尽くすまで消えることはない。', 0.0, 95.0, 0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130311, 'グリムソウルローブ', '蒼き霊力の炎をまとった、\nシノブ愛用の霊衣。\n霊の依代となる特殊な糸で紡がれ、\n霊たちの協力を得ることができる。', 250.0, 64.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(130321, '紅輝石ウィスタリア', 'アキノの身を飾るブローチ。ウィス\nタリア家に代々伝わる輝石であり、\n所有者に高潔なる精神と類まれなる\n魔力を授けてくれる。', 150.0, 60.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 5.0),
    c(130331, 'エリザベスポンチョ', '愛牛・エリザベスをイメージしてデ\nザインされたマヒルのポンチョ。着\nればボケのキレが増し、相手を混乱\nに陥れる。', 0.0, 85.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(130341, 'エターナルジョッキ', 'ユカリが手放せないジョッキ。飲ん\nでも飲んでも湧き出てくる命の水が\n所有者の体に染み渡り、その体に溢\nれんばかりの活力を与えてくれる。', 0.0, 64.0, 0.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0, 0.0),
    c(130361, 'コスモブルーロッド', 'キョウカ愛用の杖。宝玉に高位の水\n龍の力を宿し、使用者によってその\n形態を変えるという言い伝えが残さ\nれている。', 0.0, 0.0, 88.0, 0.0, 0.0, 0.0, 18.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130371, '天剣白嵐', 'ミクマ流に伝わる宝剣。\n羽のように軽くあつらえられた剣は\nトモの業前と呼応し、数多の敵を薙\nぎ払う旋風を巻き起こす。', 0.0, 60.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 10.0),
    c(130381, 'ハツネお手製の護り石', 'ハツネからシオリへと贈られた姉お\n手製の護り石。込められたハツネの\n想いが妹を勇気づけ、普段出せない\n力を発揮させる。', 0.0, 75.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0, 0.0),
    c(130401, 'BB団の絆ベレー', 'アオイが身に着けているベレー帽。\nあしらわれた一対の羽は固い絆の象\n徴。紡がれた絆を胸に、アオイは強\nい意志で立ちはだかる敵を穿つ。', 0.0, 60.0, 0.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130421, '翠霊譜ルーンノーツ', '勇気の唱喚術が記された楽譜。チカ\nの澄みわたる歌声の加護により味方\nの感覚は鋭敏になり、敵の急所が突\nきやすくなる。', 0.0, 0.0, 44.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 6.0, 0.0, 0.0, 0, 0.0),
    c(130431, 'ウルフェンブレード', '青狼の魂宿りし大剣。その一振りは\n装備者の豪胆さを象徴する竜巻の如\nく敵を襲い、同時に眠れる力を呼び\n覚ます。', 0.0, 100.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130441, '闇斧ナハトファング', 'イリヤと共に永き時を過ごした斧。\n紅き魔力の迸る巨刃は一振りで敵を\n殲滅、飛び散る鮮血の一滴までも啜\nり尽くし、主の糧とする。', 0.0, 0.0, 80.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130451, 'プレジャーチョーカー', 'クウカが着用している拘束具も兼ね\nたチョーカー。自らの動きを封じる\nことで敵を惹きつけ、人知れず悦楽\nを貪る。', 0.0, 0.0, 0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0, 0.0),
    c(130461, 'ファンタズムタイヤキ', 'タマキが大切にしている首飾り。\nたいやき型のチャームに埋め込まれ\nた魔石によって、幻影を残すほどの\n身のこなしを手にできる。', 0.0, 75.0, 0.0, 0.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130471, 'シュバリエメイル', '正義の豪炎をまとったジュンの鎧。\n付与された魔力は敵のいかなる攻撃\nも寄せ付けず、味方には勇気と活力\nを与える。', 0.0, 20.0, 0.0, 8.0, 9.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130481, '溟竜槍レヴィアタン', 'ミフユ愛用のハルバード。\n一振りすれば穂先から水流が踊り、\n持ち主を水の加護によって激しくも\n流麗に守ってくれる。', 0.0, 75.0, 0.0, 3.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130491, 'セイクリッドブレード', 'シズル愛用の十字剣。\n弱き者を助けたいと願う気高き魂が\n剣に宿る時、防御の術式が発動し、\n対象を守護する。', 0.0, 64.0, 0.0, 6.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130501, '魔眼杖デモネス・アイ', 'ミサキの武器兼パートナーの杖。\nさらなる進化を遂げた生ける魔杖だ\nが、悲しいかな現在はメイクの実験\n台と化している。', 0.0, 0.0, 97.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130511, 'ローズオブカース', '妖美な薔薇の装飾をあしらった\nミツキ愛用の眼帯。\n魔力を込めると七色の光を放射し、\n相手の能力を減退させる。', 100.0, 80.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(130521, 'アンビシャスドレス', 'いつかこれを着たい…！そんなリマ\nの夢が詰まった、オーダーメイドの\nロングドレス。夢見る乙女の妄想力\nが今、覚醒める。', 0.0, 25.0, 0.0, 9.0, 7.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130531, 'フリューゲルコート', 'モニカが着用しているコート。\nその豪奢な仕立ては、背中に続く者\nたちの心身を奮い立たせ、ありとあ\nらゆる攻撃力を大幅に向上させる。', 0.0, 52.0, 0.0, 6.0, 4.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130541, 'ハイクチュリエベルト', 'ツムギが着用している、ボビンを格\n納した特製の携行ベルト。ボビンか\nら素早く引き出された魔法の糸が敵\nを縛り上げ、瞬く間に意識を奪う。', 0.0, 50.0, 0.0, 6.0, 4.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130551, 'ストーキングマント', '自分の存在が察知されない工夫がさ\nれた、アユミお手製のマント。\n気付かれぬ間に忍び寄ることができ\n心を寄せる先輩に更に近付ける。', 0.0, 14.0, 0.0, 9.0, 9.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130561, '真打 絶海・波浪丸', 'ルカが帯刀する二本の刀。\n群がる悪党を前に二本目の刀・\n波浪丸をひとたび抜けば、\nたちまち戦場は凪ぐという。', 0.0, 20.0, 0.0, 9.0, 8.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130571, 'アシュケロン', '剣の道を極めんとジータが手にした\n片手剣。寂滅した世界の中で自在の\n剣を振り続ける者を、いつしかひと\nは剣の聖と呼んだ。', 0.0, 90.0, 0.0, 0.0, 0.0, 22.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(130581, 'プリンセスソード', 'ペコリーヌが使う『王家の装備』の\n真なる姿。もともと強力だったが、\n眠っていた力が解放されたことで、\n更なる強さを与えてくれる。', 0.0, 0.0, 0.0, 10.0, 9.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130591, 'アメスアミュレット', 'コッコロが着用している花飾り。\n神と崇めし偉大な存在の加護を受け\nており、その花から漂う優しい香り\nは、戦う勇気を授けてくれる。', 0.0, 50.0, 0.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130601, 'ケイオスグリモワール', 'キャルが携える魔導書。本に宿る溢\nれんばかりの魔力をコントロールす\nることで、記された強大な術式を自\n在に操る。', 0.0, 0.0, 94.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130611, '絆の証', 'ムイミが肌身離さず着用しているブ\nローチ。かつてこれを託してくれた\n相棒との絆の温もりが、天楼覇断剣\nを振るう力を与える。', 0.0, 99.0, 0.0, 0.0, 0.0, 9.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(130631, 'クインティタニアス', 'アリサが愛用している大弓。エルフ\nの間に伝わる伝説の弓であり、構え\nるだけで標的の動きは止まり、放た\nれる矢はあらゆる物質を射貫く。', 0.0, 95.0, 0.0, 0.0, 0.0, 16.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130651, 'ドラゴンズフィスト', 'カヤが身につける、巨大な竜の腕の\n如き篭手。装着者の激情に応じ噴き\n出す業火は、相対する者全てを焼き\n尽くすと伝えられている。', 0.0, 96.0, 0.0, 0.0, 0.0, 31.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130711, '聖域剣アヴァロン', 'クリスティーナが振るう大剣。\n計算し尽された切っ先が描く剣筋は\n何人たりとも逃れる術を与えず一刀\n両断にし、絶対の勝利を約束する。', 0.0, 100.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(130751, '傘剣ビーチプリンセス', 'ペコリーヌ愛用の夏を彩る鮮やかな\n日傘剣。弾ける笑顔と華麗かつキュ\nートな剣技が合わされば、ビーチの\n視線は一人占め間違いなし。', 0.0, 80.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(130761, '涼槍アクアスカッシュ', 'コッコロの夏仕様の槍。清涼感溢れ\nる澄み切った切っ先は目にも涼しい\n蒼の軌跡を描き、荒ぶる魔物も酷暑\nも一薙ぎでクールダウン。', 0.0, 42.0, 0.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130771, '陽杖シャインサンデー', 'スズメの夏用に新調した杖。華やか\nなデコレーションがリゾート感を全\n力で演出し、さらにどんなに転んで\nもパフェがこぼれない優れもの。', 0.0, 0.0, 40.0, 6.0, 6.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130781, '猫輪サマーフロート', 'キャルが夏を楽しむために密かに用\n意した浮輪。本人は安定性の良さで\n選んだと言い張るが、可愛さ全振り\nのデザインなので怪しいところ。', 0.0, 0.0, 85.0, 0.0, 0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130791, '氷鯛アイスダガー', 'タマキが暑い夏を乗り切るために常\n備しているアイスキャンディー。\n凍らせたたいやきのフレーバーが足\nさばきを軽くさせ、敵を翻弄する。', 0.0, 80.0, 0.0, 0.0, 0.0, 30.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(130801, '蒼竜槍ミズチ', 'ミフユが効率的に夏を過ごすための\n槍。激しく荒れ狂う海神のような水\n流をまとった一撃は、最高効率で敵\nを薙ぎ払う。', 0.0, 86.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0, 0.0),
    c(130811, '霊鎌パンプキンサイズ', 'ドクロ親父がシノブのために用意し\nた霊鎌。ハロウィンの加護を宿して\nおり、ランタンの灯は霊を冥界へと\n導き、その刃は悪霊をも切り裂く。', 0.0, 75.0, 0.0, 0.0, 0.0, 35.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(130821, 'プリンオブハロウィン', 'ハロウィンパーティーが表現された\n職人自慢のプリン。ほんのりと甘い\nカボチャ味は、あらゆるプリンを食\nべつくしたミヤコをも驚愕させた。', 0.0, 66.0, 0.0, 3.0, 3.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130831, '魔箒ハロウィン・アイ', 'ミサキにハロウィンコーデされた生\nける魔杖アイちゃん。大人のばいお\nれんすと、ハロウィンコスのかわい\nさをあわせ持つ完璧な出来らしい。', 0.0, 0.0, 60.0, 0.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(130841, '翠霊杖ルーンスノウ', '聖夜の精霊たちを宿したチカの魔法\n杖。唱喚術に呼応した精霊たちによ\nるクリスマスの加護が、対象者の能\n力を大きく向上させる。', 80.0, 0.0, 46.0, 5.0, 5.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130851, 'クリスマスアクトベル', 'クリスマスの祝福を受けたクルミ愛\n用のベル。クルミがベルを奏でて託\nす健気な想いが、仲間に決してくじ\nけない勇気を呼び起こす。', 125.0, 0.0, 0.0, 10.0, 8.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130861, 'クリスマス王ぷうきち', 'クリスマスカラーで彩られたアヤネ\nの相棒。高まる愛らしさと共にアヤ\nネの能力は引き上げられ、より強力\nな一撃を生み出すことができる。', 50.0, 80.0, 0.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130871, '猫明神ニャンフィスト', '猫に縁のある神社に祀られていた由\n緒正しき籠手。装着者に勝利を招く\nとされ、ヒヨリの正しい心と呼応し\nそのご利益は絶大である。', 0.0, 86.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(130881, '曉の祝杖ブロッサム', '新年を祝う祭で使われてきた神具の\n杖。みんなの幸せを願いながら振る\nえば花びらが舞い散り、新たな年の\n門出を鮮やかに彩る。', 0.0, 0.0, 50.0, 0.0, 5.0, 0.0, 0.0, 0.0, 30.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(130891, '氷麗刀・初華', '年初めに神を迎える神事に用いられ\nた最上の一振り。氷の如き冷たく美\nしい刀身は、深き夜の闇や禍々しき\n煩悩をも一刀両断する。', 0.0, 24.0, 0.0, 3.0, 13.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130901, 'デストロイホイッパー', '運命の人にチョコレートを作るため\n用意した、エリコにしか御しきれな\nい調理器具。愛の詰まった一撃はあ\nらゆるものを叩き壊し、すり潰す。', 0.0, 80.0, 0.0, 0.0, 0.0, 25.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(130911, 'デコレーションハート', '大切な弟くんに美味しいチョコを作\nるため、シズルが身に着ける帽子。\nハートの飾りからあふれる甘い香り\nが、仲間に愛と安らぎを与える。', 100.0, 80.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130921, 'アンの魔導書', 'アン愛用の魔導書。類稀なる魔法の\n才能を最大限に引き出すことができ\nる。国を導かんとする王女の決意が\n英霊の力を更に強力なものにする。', 0.0, 0.0, 88.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 1.0, 0, 0.0),
    c(130931, 'オメメちゃん！', 'ルゥの相棒・オメメちゃん。見慣れ\nぬ異世界でもなぜか召喚され、いつ\nものように道具として用いられるの\nは、信頼関係があるから…のはず。', 0.0, 0.0, 70.0, 0.0, 0.0, 0.0, 35.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130941, 'ドラグアミュレット', 'グレアの持つ力を高めてくれる\n竜のアミュレット。宝石に込めら\nれた加護を受け竜姫の炎は勢いを\n増し、全ての敵を燃やし尽くす。', 0.0, 0.0, 92.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0, 0.0, 0, 0.0),
    c(130951, '千紫万紅艶椿', 'クウカの心を熱くする妖艶な着物。\n帯の締め付け具合によって興奮が高\nまり、それを解放した時、未知なる\n悦楽が回転とともに解き放たれる。', 0.0, 0.0, 0.0, 7.0, 12.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 0.0),
    c(130961, 'なりきりクノイチセット', 'ニノンがオーエド町で買った忍者に\nなりきるための装備。武器自体に特\n別な力はないが、これを持つニノン\nはなぜかクノイチとして覚醒する。', 0.0, 85.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(130971, 'レムの髪飾り', 'レムが常に身に着けている髪飾り。\n大好きな姉とお揃いであり、姉の髪\n色に合わせた赤の紐細工が気に入っ\nているらしい。', 0.0, 33.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 0, 15.0),
    c(130981, 'ラムの髪飾り', 'ラムが常に身に着けている髪飾り。\n彼女にとってメイドとしての証でも\nあり、妹の髪色に合わせた青の紐\n細工が気に入っているらしい。', 0.0, 0.0, 52.0, 8.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(130991, '約束の花束', 'エミリアが大切にしている花束。舞\nい散る雪のように儚くきらめく花弁\nはマナに満ち溢れており、精霊たち\nに愛寵されている。', 0.0, 0.0, 96.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 6.0, 1.0, 0.0, 0, 0.0),
    c(131001, '盛夏弓スプラッシュハート', '夏の仕事に向けスズナが新調した\n弓。夏真っ盛りの海辺を思わせる涼\nし気なデザインと配色が、スズナこ\nだわりの推しポイント。', 0.0, 96.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(131011, '恵愛剣サマーラブファミリア', '夏の海辺でイオが生徒を護るために\n振るう剣。持ち前の生徒を想う心を\n癒しの力へ変えてくれる。この夏も\n大活躍間違いなし。', 0.0, 0.0, 80.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 6.0, 0.0, 0.0, 0, 0.0),
    c(131031, '繊麗剣サマーブライト', 'サレンが夏に携えている剣。救護院\nのママとしてではなく、一人の女性\nとしても夏を楽しんでほしいという\n子供たちの願いが込められている。', 0.0, 80.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 30.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(131041, 'サマーウルフェンソード', '特別な凪の海に顕れると云われる\n海狼の牙を鍛え上げた大剣。狼の\n飾りはマコトの大のお気に入り。', 0.0, 88.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(131051, '琉球犬式・神舞之籠手', '海神たる大海原に舞を捧げるための\n神具の籠手。布の模様は海への数多\nの感謝が込められており、この籠手\nで舞うカオリは大海を体現する。', 0.0, 90.0, 0.0, 0.0, 0.0, 28.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(131061, '夏華杖ファンシーロア', 'ビーチ仕様のマホ姫謹製、魔法杖。\n夏の情景が封じ込められており、\n一振りすれば、灯火が映し出す影絵\nと共に夜空に大輪の華が咲く。', 0.0, 0.0, 78.0, 0.0, 0.0, 0.0, 18.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(131071, 'なかよしの弓琴', '聖テレサ女学院編入に際し新調した\nアオイのぼっち克服のための最終兵\n器。お守り代わりのものだったが、\n今は絆の象徴となっている。', 0.0, 91.0, 0.0, 0.0, 0.0, 24.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(131081, 'フロムダスク・ティルドーン', '調理・裁縫・弟たちの図画工作など\n用途多彩なクロエの万能日用道具。\nと言い張ることで教務主任の所持品\n検査に対し絶大な防御力をふるう。', 0.0, 77.0, 0.0, 0.0, 0.0, 35.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(131091, 'ももいろ☆ぺんら☆なっくる', 'かわつよを追求するチエルお手製の\nはぴちぇる拳鍔。有事には蛍光ピン\nクの爪をぽきりと折れば発光魔法が\n発動して憧れの歌姫を応援できる。', 0.0, 79.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(131101, 'ペンシルアックス・レプリカ', 'ユニが伊達や酔狂で携行する、鉾槍\nの模造品。重厚な外見に反してお子\n様も安心の軽量設計。自立性はなく\n支えが失われればパタリと倒れる。', 0.0, 0.0, 56.0, 0.0, 0.0, 0.0, 0.0, 200.0, 30.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(131111, 'ハロウィン猫さんブルーム', 'ハロウィンのためにキョウカがこっ\nそり用意した黒猫がモチーフのほう\nき。時折またがって空を飛ぶ想像を\nするのはみんなには秘密らしい。', 0.0, 0.0, 96.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(131121, '魔拳トリックオアトリック', 'ハロウィンのために、ミソギが自信\n満々に準備した特別なイタズラ用の\n手甲。高い強度と精密性を両立し、\nどんなイタズラもバッチリらしい。', 0.0, 50.0, 0.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 8.0),
    c(131131, 'ぐるぐるうさぎさんブレード', 'ハロウィンのためにミミがお母さん\nと作った、包帯でぐるぐる巻きのう\nさぎさんブレード。かわいらしさと\n手触り両方がアップしたらしい。', 0.0, 33.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(131141, 'ルナのおともだち', 'ルナが常に抱いているおともだち。\n物言わぬ小さな友は今日もつぶらな\n瞳のままルナを見つめ続けている。', 0.0, 0.0, 75.0, 0.0, 0.0, 0.0, 0.0, 0.0, 30.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(131151, '聖刻剣アヴァロン', 'サンタクロース候補となったクリス\nティーナに装いを合わせた聖域剣ア\nヴァロン。聖夜の奇跡により主に絶\n対の勝利を贈るという。', 0.0, 86.0, 0.0, 0.0, 0.0, 20.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0, 0.0),
    c(131161, '聖霊剣セイントホープ', 'サンタクロース候補となったノゾミ\nの片手剣。アイドルとしての決意と\nたくさんの人への夢と希望の想いが\nその刃に眩い煌きを与えている。', 290.0, 0.0, 0.0, 12.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 4.0, 0.0, 0.0, 0, 0.0),
    c(131171, '聖夜斧ノエルファング', 'サンタクロース候補となったイリヤ\n愛用の斧が聖夜の奇跡により魅せた\n新たな姿。柊により華麗に彩られし\n巨刃は不滅の輝きを宿している。', 100.0, 0.0, 75.0, 0.0, 0.0, 0.0, 8.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0, 0.0),
    c(131191, '新春祈幸の精霊杖', '晴れ着姿のコッコロが持つ神気溢れ\nる神聖な杖。新春を祝う巫女の舞が\n周囲の仲間たちにも活力を分け与え\n新たな年の幸せを約束する。', 30.0, 0.0, 0.0, 9.0, 10.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(131201, '賀正猫耳の羽子板', '晴れ着姿のキャルが持つ特注品の羽\n子板。新たな年の多幸を願う気持ち\nが無数の羽根を生み出し、あらゆる\n災いを祓い退ける。', 0.0, 0.0, 74.0, 0.0, 0.0, 0.0, 10.0, 0.0, 25.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(131211, '神殿巫女の鈴飾り', '神殿で巫女を務めるスズメが持つ神\n楽鈴。代々受け継がれた巫女たちの\n祈りが籠められており鈴の音の届く\n範囲の邪気を打ち祓う。', 0.0, 0.0, 67.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10.0, 3.0, 0.0, 0, 0.0),
    c(131221, 'マジカルミスティロッド', '魔法探偵ミスティ★カスミが操る魔\n法の杖。愛と希望の力を込めること\nで邪悪な敵を捕らえ、どんな真実も\n明らかにする輝きを放つ。', 0.0, 0.0, 52.0, 4.0, 6.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(131231, 'マジカルピュアリーボウ', '魔法狩人ピュアリー★シオリが操る\n魔法の弓。愛と希望の力を込めるこ\nとで、どんな邪悪な敵も貫く必殺の\n矢を放つことができる。', 0.0, 84.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(131241, 'ステージオブキュート', 'ウヅキの持つオーソドックスな剣。\n特別な力はなさそうに見えるがウヅ\nキの笑顔とあたたかい想いに応じて\n輝き、秘めた力を発揮する。', 0.0, 82.0, 0.0, 0.0, 0.0, 34.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0, 0.0),
    c(131251, 'ステージオブクール', 'リンの操る蒼く美しき剣。クールに\n燃えるリンの熱い心に呼応して蒼い\n輝きを放ち、どこまでも高みを目指\nし走り続ける彼女の旅路を照らす。', 220.0, 0.0, 0.0, 8.0, 8.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0),
    c(131261, 'ステージオブパッション', 'ミオ愛用のきらめく星杖。ミオの明\nるい歌声に応え、小さな流星を呼び\nよせ、歌う様子はスペースオペラの\nよう。', 0.0, 0.0, 90.0, 0.0, 0.0, 0.0, 16.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0.0)
  ];
})();
