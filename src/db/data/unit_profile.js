export default (() => {
  const c = (unit_id, unit_name, age, guild, race, height, weight, birth_month, birth_day, blood_type, favorite, voice, catch_copy, self_text, guild_id) =>
    ({ unit_id, unit_name, age, guild, race, height, weight, birth_month, birth_day, blood_type, favorite, voice, catch_copy, self_text, guild_id });
  return [
    c(100101, 'ヒヨリ', '16', 'トゥインクルウィッシュ', '獣人族', '155', '44', '8', '27', 'A', '人助け、応援', '東山奈央', '人助けが大好き！　前向き格闘娘', 'こんにちは！　ヒヨリでっす！\n困っている人がいたら助けにいくよ！\nよかったら一緒に来ない？', '2'),
    c(100201, 'ユイ', '17', 'トゥインクルウィッシュ', 'ヒューマン', '158', '47', '4', '5', 'O', '料理、人間観察', '種田梨沙', '戦闘のサポートが得意な、心優しい少女', 'あんまり役に立てるかはわからないけど…\nわたしも頑張って、\nみんなをサポートするね！', '2'),
    c(100301, 'レイ', '18', 'トゥインクルウィッシュ', '魔族', '163', '46', '1', '12', 'B', '読書、乗馬、お茶', '早見沙織', 'クールで何事にも真っ直ぐな剣士', 'キミと会ったのもきっと何かの縁だ\n一緒に塔の頂上を目指す仲間として\n頑張っていこう。よろしく頼む', '2'),
    c(100401, 'ミソギ', '9', 'リトルリリカル', 'ヒューマン', '128', '27', '8', '10', 'O', 'いたずら、探検', '諸星すみれ', '探検好きのイタズラっ子', 'イタズラなら任せて！\nにいちゃん、引っかからないように気を付けなよー♪', '5'),
    c(100501, 'マツリ', '12', '王宮騎士団（NIGHTMARE）', '獣人族', '146', '40', '11', '25', 'O', 'ヒーローごっこ', '下田麻美', 'ヒーローに憧れる騎士見習いの少女', '？？？', '8'),
    c(100601, 'アカリ', '13', '悪魔偽王国軍（ディアボロス）', '魔族', '150', '42', '11', '22', 'O', 'サックス', '浅倉杏美', '甘え上手なみんなの人気者', 'アカリ、まだわからないことが多くて…\nだからこれから\nいろいろ教えてくださいね、お兄ちゃん！', '7'),
    c(100701, 'ミヤコ', '14', '悪魔偽王国軍（ディアボロス）', '魔族', '130', '32', '1', '23', 'B', 'プリンを食べること', '雨宮天', 'プリン大好きゴースト娘', '難しいことはわからないの～\nただ毎日プリンを食べられるなら、\n幽霊のままでいいの～', '7'),
    c(100801, 'ユキ', '14', 'ヴァイスフリューゲル　ランドソル支部', 'エルフ', '150', '40', '10', '10', 'AB', '鏡で自分を見ること', '大空直美', 'ボクは誰よりも美しい', 'ボクって本当に美しいなあ…\n可愛くて美しいなんて本当に罪だと思うけど\n生まれもったものだから仕方ないんだ♪', '15'),
    c(100901, 'アンナ', '17', 'トワイライトキャラバン', '魔族', '159', '45', '7', '5', 'A', '小説執筆', '髙野麻美', '前世を信じる中二病患者、「疾風の冥姫」', 'いいか、絶対に私を真名で呼ぶなよ？\n常に「機関」の眼や耳の存在を疑え\nそれが、生きのびるための術だ…！', '13'),
    c(101001, 'マホ', '16', '自警団（カォン）', '獣人族', '155', '42', '9', '22', 'O', '空想、ぬいぐるみ集め', '内田真礼', 'マホマホ王国のプリンセス', 'マホマホ王国のお姫はんの、マホ姫どす！\nけったいな顔してどないしはったん？\nマホマホ王国はずーっと遠くの国なんどす？', '10'),
    c(101101, 'リノ', '15', 'ラビリンス', 'ヒューマン', '156', '44', '8', '25', 'A', 'お裁縫', '阿澄佳奈', '人懐っこくてマシンガントークな妹系少女', '覚えていないと思うんですけど…\n私は妹なんですよ！\nだからお兄ちゃんって呼んでいいですか？', '3'),
    c(101201, 'ハツネ', '17', 'フォレスティエ', 'エルフ', '156', '46', '12', '24', 'A', '妹と遊ぶこと、二度寝、昼寝、早寝', '大橋彩香', 'みんなのために超能力を使う眠り姫', '私はハツネ！　困っている人の味方だよ！\n困った時は、いつでも言ってね♪\n私のちょ…ま、魔法で助けてあげるから！', '6'),
    c(101301, 'ナナカ', '18', 'トワイライトキャラバン', '魔族', '166', '55', '8', '21', 'O', '読書、魔法', '佳村はるか', 'オタク全開な魔法少女', '', '13'),
    c(101401, 'カスミ', '18', '自警団（カォン）', '獣人族', '152', '41', '11', '3', 'AB', '読書、推理', '水瀬いのり', '頭脳明晰な美少女名探偵', 'test', '10'),
    c(101501, 'ミサト', '21', 'フォレスティエ', 'エルフ', '165', '54', '9', '5', 'O', '絵本作り', '國府田マリ子', '母性溢れる優しいみんなの「ミサト先生」', 'test', '6'),
    c(101601, 'スズナ', '18', 'ルーセント学院', '魔族', '167', '48', '4', '10', 'O', 'ファッション', '上坂すみれ', '天真爛漫で人気者のカリスマモデル', 'ヒデサイ、ちょっす～！　うち、漢字と計算は\nちょっち…てか、おに苦手なんだ～\nでもでも、ファッションだったら任せて～！', '14'),
    c(101701, 'カオリ', '19', '自警団（カォン）', '獣人族', '158', '53', '7', '7', 'A', '踊り、空手', '高森奈津美', 'いつでも「なんくるないさ～」な天然娘', 'ハイターイ！　歌って踊って、\n最高に盛り上がるさ～！\nやさやさ、キミも一緒に踊るさ～！', '10'),
    c(101801, 'イオ', '23', 'ルーセント学院', '魔族', '162', '52', '8', '14', 'B', '恋愛小説、恋愛舞台、恋愛漫画の鑑賞', '伊藤静', '多くの男性を魅了する無垢な女教師', 'いつも助けてくれてありがとう\n私のほうが年上なのに\n頼ってばかりでごめんなさい～', '14'),
    c(102001, 'ミミ', '10', 'リトルリリカル', '獣人族', '117', '21', '4', '3', 'O', 'かわいいもの集め', '日高里菜', 'お歌もにんじんも、ウサギさんも大好き♪', 'ぴょんぴょん、うさぎさんになりたいな～♪　\nミミ、うさぎさんになれたら、\n最初におにいちゃんに見せてあげるね！', '5'),
    c(102101, 'クルミ', '12', 'サレンディア救護院', 'ヒューマン', '150', '40', '6', '9', 'B', '観劇、おままごと', '植田佳奈', '泣き虫で臆病な守ってあげたい女の子', 'あの、えっと…私、く、クルミですぅ…\nふ、ふぇぇぇ…ど、どうしようぅ…\nは、恥かしくて…ご、ごめんなさいぃぃ！', '9'),
    c(102201, 'ヨリ', '13', '悪魔偽王国軍（ディアボロス）', '魔族', '150', '40', '11', '22', 'O', 'ゲーム全般', '原紗友里', '人見知りであまのじゃくな女の子', 'え、えっと…こ、こういうときって、\nどういうことを言えばいいんだっけ…\nうう、どうしてちゃんと喋れないの…', '7'),
    c(102301, 'アヤネ', '14', 'サレンディア救護院', 'ヒューマン', '148', '38', '5', '10', 'B', '屋内でできる遊び', '芹澤優', 'ぷうきちといつも一緒！', 'この子はね、ぷうきちって言うんだ\n武器なんだけど、しゃべるんだよ♪\n大事な大事な、私の友達なんだぁ～！', '9'),
    c(102501, 'スズメ', '15', 'サレンディア救護院', 'ヒューマン', '154', '43', '12', '12', 'O', 'ご奉仕', '悠木碧', 'お嬢さまのためにがんばるドジっ娘メイド', 'うぅ…ごめんなさい～…\nまたキッチンを爆発させてしまいました～\nこれじゃあメイド失格です…', '9'),
    c(102601, 'リン', '17', '牧場（エリザベスパーク）', '獣人族', '144', '42', '1', '1', 'B', 'あんパン', '小岩井ことり', '遊びと睡眠が何より大事なぐうたら娘', 'test', '11'),
    c(102701, 'エリコ', '16', 'トワイライトキャラバン', '魔族', '154', '43', '7', '30', 'B', '実験、裁縫、料理', '橋本ちなみ', '運命の相手に一途すぎる乙女', '『壊し屋』の二つ名を持つ私…\nですが、怖がる必要はありませんわ\nあなた様は大切な運命の人ですから…', '13'),
    c(102801, 'サレン', '17', 'サレンディア救護院', 'エルフ', '156', '43', '10', '4', 'A', '経営、お茶会', '堀江由衣', '救護院を経営する優しい庶民派お嬢様', '貧乏性？　いいえ、\n「もったいない」の精神で\n日々を過ごしてるだけよ！', '9'),
    c(102901, 'ノゾミ', '17', 'カルミナ', 'ヒューマン', '157', '40', '1', '24', 'B', '舞台鑑賞、ダンス', '日笠陽子', '歌って踊れる大人気アイドル', 'いつか世界中の人達をファンにしてみせる！\nトップアイドルになるその日まで、\n応援よろしくね♪', '4'),
    c(103001, 'ニノン', '16', 'ヴァイスフリューゲル　ランドソル支部', 'ヒューマン', '163', '51', '8', '31', 'O', '忍法開発', '佐藤聡美', 'トーゴクの神秘、オシエテクダサイ！', 'スシ、ゲイシャ、テンプラ…\nはふぅ～！\nトーゴクの文化はステキデスね～！', '15'),
    c(103101, 'シノブ', '18', '悪魔偽王国軍（ディアボロス）', '魔族', '157', '42', '12', '22', 'AB', '占い', '大坪由佳', '占いが得意な霊能少女', '私、小さい頃から人には見えないものが\n見えていたんです。今もあなたの後ろに\n一人、二人、三人…賑やかですね', '7'),
    c(103201, 'アキノ', '18', 'メルクリウス財団', 'ヒューマン', '157', '45', '3', '12', 'AB', '慈善事業', '松嵜麗', '一人前の商人を目指すパワフルお嬢様', 'この私とともにいる限り、\nお金に不自由はさせませんわ！', '12'),
    c(103301, 'マヒル', '20', '牧場（エリザベスパーク）', 'ヒューマン', '142', '35', '3', '3', 'B', '漫才', '新田恵海', 'みんなを笑顔にするお笑い牧場主', 'オラはどんな時でもみんなに笑顔を届ける\n最高の芸人目指してる！\n一緒に頑張るべ！', '11'),
    c(103401, 'ユカリ', '22', 'メルクリウス財団', 'エルフ', '164', '55', '3', '16', 'A', 'ウインドーショッピング', '今井麻美', '純情でほっとけない大人の女性', 'キミには情けないところばかり\n見られているけど、こんなところ、\nキミ以外には見せないんだからね？', '12'),
    c(103601, 'キョウカ', '8', 'リトルリリカル', 'エルフ', '118', '21', '2', '2', 'A', 'お勉強', '小倉唯', '礼儀正しくしっかり者のちびっ子優等生', 'test', '5'),
    c(103701, 'トモ', '13', '王宮騎士団（NIGHTMARE）', 'ヒューマン', '149', '43', '8', '11', 'A', '剣術、年長者をからかう', '茅原実里', '義理堅くてからかい好きな剣術少女', 'test', '8'),
    c(103801, 'シオリ', '14', '牧場（エリザベスパーク）', '獣人族', '153', '40', '11', '3', 'A', '読書、お散歩', '小清水亜美', '読書が趣味の病弱少女', 'ゴホッ、ゴホッ…か、身体は弱いけど、\nせめて気持ちだけでも前向きに…！\nあっ、でもダメ…立ちくらみが…', '11'),
    c(104001, 'アオイ', '13', 'フォレスティエ', 'エルフ', '158', '44', '6', '6', 'AB', '友達作りのイメトレ', '花澤香菜', '「友達」に憧れる、エルフの森の女の子', '友達ができるその日まで…\nBB団で\nトレーニングですっ！', '6'),
    c(104201, 'チカ', '17', 'カルミナ', 'ヒューマン', '163', '46', '6', '3', 'O', '各種楽器', '福原綾香', '人々を守るために歌う、唱喚士の少女', '私は人々の平和を守るため、唱喚術を使って\n戦います。…最近は、ア、アイドルとしても\n活動してますが、そちらはまだ不慣れで…', '4'),
    c(104301, 'マコト', '17', '自警団（カォン）', '獣人族', '168', '54', '8', '9', 'O', 'お菓子作り', '小松未可子', '男勝りで情に厚いワイルド娘', '腹へってたら言えよな\n簡単でよければ\nすっげー旨いもん食わせてやるよ！', '10'),
    c(104401, 'イリヤ', '??', '悪魔偽王国軍（ディアボロス）', '魔族', '172', '50', '5', '5', 'A', '世界征服', '丹下桜', 'かつては夜を支配した最強の吸血鬼', 'test', '7'),
    c(104501, 'クウカ', '18', 'ヴァイスフリューゲル　ランドソル支部', 'ヒューマン', '157', '49', '11', '19', 'AB', '小説を読むこと', '長妻樹里', '妄想大好き！　ほんとは照れ屋な女の子', 'あなたのことを考えていました\n…逆らえないクウカをああして、こうして\nぐふ、ぐふふふ…', '15'),
    c(104601, 'タマキ', '18', 'メルクリウス財団', '獣人族', '158', '48', '3', '1', 'AB', '猫とたわむれること', '沼倉愛美', '弱きを助け強きをくじく猫娘', 'お金もうけの話なら、ぜひともあたしに\n持ってくるにゃ！　稼げるなら１ルピだって\n見逃さないのが、あたしの信条にゃ～♪', '12'),
    c(104701, 'ジュン', '25', '王宮騎士団（NIGHTMARE）', 'ヒューマン', '171', '50', '10', '25', 'A', '格闘技、湯浴み', '川澄綾子', '素顔を見せない冷静沈着な女性騎士', '？？？', '8'),
    c(104801, 'ミフユ', '20', 'メルクリウス財団', 'ヒューマン', '163', '49', '11', '11', 'O', '傭兵などのアルバイト', '田所あずさ', '仕事も私事も効率優先な傭兵少女', '私がキミの師匠になってあげる！\nもちろんタダとはいかないわ\n時給はしっかりもらうから', '12'),
    c(104901, 'シズル', '18', 'ラビリンス', 'ヒューマン', '168', '54', '10', '24', 'O', '家事全般', '生天目仁美', 'お姉ちゃんがお世話してあげるからねっ！', '身の回りのお世話はお姉ちゃんがやってあげるね！\nお料理も、お洗濯も、お掃除も\nお風呂で背中も流してあげちゃうぞっ！', '3'),
    c(105001, 'ミサキ', '11', 'ルーセント学院', '魔族', '120', '22', '1', '3', 'A', 'ファッション誌鑑賞、コスメ集め', '久野美咲', 'ちょっとおませな恋に恋する女の子', 'アタシのこと呼んだ？\nレディの魅力で夢中にさせてあげるわね！', '14'),
    c(105101, 'ミツキ', '27', 'トワイライトキャラバン', 'ヒューマン', '166', '53', '3', '7', 'A', '研究、実験', '三石琴乃', '実験が趣味の危険な科学者', '私は科学者だけど、\n医者の真似事もしてるの\n病気になったら診てあげるわ', '13'),
    c(105201, 'リマ', '18', '牧場（エリザベスパーク）', '獣人族', '150', '100', '3', '14', 'A', '毛繕い、お喋り', '徳井青空', '乙女チックなもふもふアニマル', '私、ごく普通の、どこにでもいる女の子よ！\nみ、見た目以外はね…', '11'),
    c(105301, 'モニカ', '18', 'ヴァイスフリューゲル　ランドソル支部', 'ヒューマン', '140', '33', '7', '28', 'A', 'お菓子屋通い', '辻あゆみ', '見た目も中身もお子ちゃまな異国の軍人', '「白き翼」こと、ヴァイスフリューゲル…\nその名に恥じぬよう、天高く舞い、\n華麗に敵を倒してみせる！', '15'),
    c(105401, 'ツムギ', '14', 'カルミナ', 'ヒューマン', '153', '45', '9', '7', 'AB', '裁縫', '木戸衣吹', 'ファッション大好きなキュートガール', 'test', '4'),
    c(105501, 'アユミ', '16', 'ヴァイスフリューゲル　ランドソル支部', 'エルフ', '155', '43', '4', '7', 'O', '観察', '大関英里', 'どこまでも一途に慕う、純情乙女', 'test', '15'),
    c(105601, 'ルカ', '25', 'トワイライトキャラバン', 'ヒューマン', '167', '54', '7', '11', 'B', '釣り', '佐藤利奈', '人情味溢れる粋でいなせな「姉御」', 'test', '13'),
    c(105701, 'ジータ', '17', '？？？', 'ヒューマン', '156', '45', '3', '10', 'O', '冒険、おしゃべり', '金元寿子', '空への冒険を夢見る騎空士の少女', '私ね、一人前の騎空士になりたいんだ\nいつか父さんみたいな騎空士になって、\n空の果てまで旅する。それが私の夢だよ！', ''),
    c(105801, 'ペコリーヌ', '17', '美食殿', 'ヒューマン', '156', '46', '3', '31', 'O', '食べ歩き、料理', 'M・A・O', 'いつも元気な腹ペコ少女', 'あ、あの…何か食べ物持っていませんか？\nもう、お腹ペコペコで…', '1'),
    c(105901, 'コッコロ', '11', '美食殿', 'エルフ', '140', '35', '5', '11', 'B', '瞑想、動植物の飼育', '伊藤美来', '主を慕う、小さなガイド役', '主さまのガイド役を仰せつかりました\nわたくし、主さまに満足していただけるよう\n誠心誠意尽くさせていただきます', '1'),
    c(106001, 'キャル', '14', '美食殿', '獣人族', '152', '39', '9', '2', 'A', '猫と遊ぶ', '立花理香', '行き倒れの謎のネコミミ魔法使い', 'なに、モタモタしてんのよ\n仕方ないから、あたしが手伝ってあげるわ\nいい？　感謝しなさいよね！', '1'),
    c(106101, 'ムイミ', '16', '？？？', 'ヒューマン', '148', '40', '8', '11', 'O', '冒険、思い出話', '潘めぐみ', 'さまよえる謎の少女', 'いいんだ、アタシは……独りでも。大丈夫だから、もう慣れたからさぁ', ''),
    c(106301, 'アリサ', '15', '？？？', 'エルフ', '155', '42', '6', '17', 'O', 'キレイな葉っぱを集めること', '優木かな', '森番を目指すエルフの少女', '', ''),
    c(106501, 'カヤ', '16', 'ドラゴンズネスト', 'ドラゴン族', '156', '???', '6', '25', 'B', '格闘技', '小市眞琴', '拳で語る喧嘩屋ドラゴン少女', '', '17'),
    c(106601, 'イノリ', '13', 'ドラゴンズネスト', 'ドラゴン族', '145', '???', '9', '29', 'AB', 'ゲーム', '藤田茜', '口が達者なヘタレドラゴン', '', '17'),
    c(106801, 'ラビリスタ', '25', 'ラビリンス', 'ヒューマン', '160', '??', '7', '25', 'AB', '人間観察', '沢城みゆき', '秘密結社ラビリンスの『迷宮女王』', '', '3'),
    c(107001, 'ネネカ', '24', '？？？', 'エルフ', '149', '??', '3', '24', 'O', '物真似、芸術鑑賞', '井口裕香', '研究所に隠れ住む物静かなお姉さん', '', ''),
    c(107101, 'クリスティーナ', '27', '王宮騎士団（NIGHTMARE）', 'ヒューマン', '165', '??', '2', '7', 'O', '強敵との闘争', 'たかはし智秋', '傍若無人な王宮騎士団副団長', '', '8'),
    c(107501, 'ペコリーヌ（サマー）', '17', '美食殿', 'ヒューマン', '156', '46', '3', '31', 'O', '食べ歩き、料理', 'M・A・O', 'いつも元気な腹ペコ少女', 'あ、あの…何か食べ物持っていませんか？\nもう、お腹ペコペコで…', '1'),
    c(107601, 'コッコロ（サマー）', '11', '美食殿', 'エルフ', '140', '35', '5', '11', 'B', '瞑想、動植物の飼育', '伊藤美来', '主を慕う、小さなガイド役', '主さまのガイド役を仰せつかりました\nわたくし、主さまに満足していただけるよう\n誠心誠意尽くさせていただきます', '1'),
    c(107701, 'スズメ（サマー）', '15', 'サレンディア救護院', 'ヒューマン', '154', '43', '12', '12', 'O', 'ご奉仕', '悠木碧', 'お嬢さまのためにがんばるドジっ娘メイド', 'うぅ…ごめんなさい～…\nまたキッチンを爆発させてしまいました～\nこれじゃあメイド失格です…', '9'),
    c(107801, 'キャル（サマー）', '14', '美食殿', '獣人族', '152', '39', '9', '2', 'A', '猫と遊ぶ', '立花理香', '行き倒れの謎のネコミミ魔法使い', 'なに、モタモタしてんのよ\n仕方ないから、あたしが手伝ってあげるわ\nいい？　感謝しなさいよね！', '1'),
    c(107901, 'タマキ（サマー）', '18', 'メルクリウス財団', '獣人族', '158', '48', '3', '1', 'AB', '猫とたわむれること', '沼倉愛美', '弱きを助け強きをくじく猫娘', 'お金もうけの話なら、ぜひともあたしに\n持ってくるにゃ！　稼げるなら１ルピだって\n見逃さないのが、あたしの信条にゃ～♪', '12'),
    c(108001, 'ミフユ（サマー）', '20', 'メルクリウス財団', 'ヒューマン', '163', '49', '11', '11', 'O', '傭兵などのアルバイト', '田所あずさ', '仕事も私事も効率優先な傭兵少女', '私がキミの師匠になってあげる！\nもちろんタダとはいかないわ\n時給はしっかりもらうから', '12'),
    c(108101, 'シノブ（ハロウィン）', '18', '悪魔偽王国軍（ディアボロス）', '魔族', '157', '42', '12', '22', 'AB', '占い', '大坪由佳', '占いが得意な霊能少女', '私、小さい頃から人には見えないものが\n見えていたんです。今もあなたの後ろに\n一人、二人、三人…賑やかですね', '7'),
    c(108201, 'ミヤコ（ハロウィン）', '14', '悪魔偽王国軍（ディアボロス）', '魔族', '130', '32', '1', '23', 'B', 'プリンを食べること', '雨宮天', 'プリン大好きゴースト娘', '難しいことはわからないの～\nただ毎日プリンを食べられるなら、\n幽霊のままでいいの～', '7'),
    c(108301, 'ミサキ（ハロウィン）', '11', 'ルーセント学院', '魔族', '120', '22', '1', '3', 'A', 'ファッション誌鑑賞、コスメ集め', '久野美咲', 'ちょっとおませな恋に恋する女の子', 'アタシのこと呼んだ？\nレディの魅力で夢中にさせてあげるわね！', '14'),
    c(108401, 'チカ（クリスマス）', '17', 'カルミナ', 'ヒューマン', '163', '46', '6', '3', 'O', '各種楽器', '福原綾香', '人々を守るために歌う、唱喚士の少女', '私は人々の平和を守るため、唱喚術を使って\n戦います。…最近は、ア、アイドルとしても\n活動してますが、そちらはまだ不慣れで…', '4'),
    c(108501, 'クルミ（クリスマス）', '12', 'サレンディア救護院', 'ヒューマン', '150', '40', '6', '9', 'B', '観劇、おままごと', '植田佳奈', '泣き虫で臆病な守ってあげたい女の子', 'あの、えっと…私、く、クルミですぅ…\nふ、ふぇぇぇ…ど、どうしようぅ…\nは、恥かしくて…ご、ごめんなさいぃぃ！', '9'),
    c(108601, 'アヤネ（クリスマス）', '14', 'サレンディア救護院', 'ヒューマン', '148', '38', '5', '10', 'B', '屋内でできる遊び', '芹澤優', 'ぷうきちといつも一緒！', 'この子はね、ぷうきちって言うんだ\n武器なんだけど、しゃべるんだよ♪\n大事な大事な、私の友達なんだぁ～！', '9'),
    c(108701, 'ヒヨリ（ニューイヤー）', '16', 'トゥインクルウィッシュ', '獣人族', '155', '44', '8', '27', 'A', '人助け、応援', '東山奈央', '人助けが大好き！　前向き格闘娘', 'こんにちは！　ヒヨリでっす！\n困っている人がいたら助けにいくよ！\nよかったら一緒に来ない？', '2'),
    c(108801, 'ユイ（ニューイヤー）', '17', 'トゥインクルウィッシュ', 'ヒューマン', '158', '47', '4', '5', 'O', '料理、人間観察', '種田梨沙', '戦闘のサポートが得意な、心優しい少女', 'あんまり役に立てるかはわからないけど…\nわたしも頑張って、\nみんなをサポートするね！', '2'),
    c(108901, 'レイ（ニューイヤー）', '18', 'トゥインクルウィッシュ', '魔族', '163', '46', '1', '12', 'B', '読書、乗馬、お茶', '早見沙織', 'クールで何事にも真っ直ぐな剣士', 'キミと会ったのもきっと何かの縁だ\n一緒に塔の頂上を目指す仲間として\n頑張っていこう。よろしく頼む', '2'),
    c(109001, 'エリコ（バレンタイン）', '16', 'トワイライトキャラバン', '魔族', '154', '43', '7', '30', 'B', '実験、裁縫、料理', '橋本ちなみ', '運命の相手に一途すぎる乙女', '『壊し屋』の二つ名を持つ私…\nですが、怖がる必要はありませんわ\nあなた様は大切な運命の人ですから…', '13'),
    c(109101, 'シズル（バレンタイン）', '18', 'ラビリンス', 'ヒューマン', '168', '54', '10', '24', 'O', '家事全般', '生天目仁美', 'お姉ちゃんがお世話してあげるからねっ！', '身の回りのお世話はお姉ちゃんがやってあげるね！\nお料理も、お洗濯も、お掃除も\nお風呂で背中も流してあげちゃうぞっ！', '3'),
    c(109201, 'アン', '17', '？？？', 'ヒューマン', '156', '55', '12', '1', 'AB', '読書', '日笠陽子', '英霊と契約を結んだマナリアの天才王女', '私はアン！一応、マナリア王国の\n第一王女だけど…あまりかしこまらないで、\n気軽に仲良くしてくれたら嬉しいな！', ''),
    c(109301, 'ルゥ', '15', '？？？', 'ヒューマン', '144', '45', '2', '4', 'O', '食べること、眠ること', 'こやまきみこ', 'マナリア魔法学院の新入生', 'ルゥはルゥですぅ！マナリア魔法学院に\n通ってるですぅ。あなたもルゥの\nお友だちになってくれるですか？', ''),
    c(109401, 'グレア', '17', '？？？', '半人半竜', '167', '67', '11', '3', 'B', 'ピアノ', '福原綾香', '人を超越した力を有す心優しい竜姫', '私はグレア。竜と人、両方の血を\n受け継いでいるの…\nえっと…よ、よろしくね', ''),
    c(109501, 'クウカ（オーエド）', '18', 'ヴァイスフリューゲル　ランドソル支部', 'ヒューマン', '157', '49', '11', '19', 'AB', '小説を読むこと', '長妻樹里', '妄想大好き！　ほんとは照れ屋な女の子', 'あなたのことを考えていました\n…逆らえないクウカをああして、こうして\nぐふ、ぐふふふ…', '15'),
    c(109601, 'ニノン（オーエド）', '16', 'ヴァイスフリューゲル　ランドソル支部', 'ヒューマン', '163', '51', '8', '31', 'O', '忍法開発', '佐藤聡美', 'トーゴクの神秘、オシエテクダサイ！', 'スシ、ゲイシャ、テンプラ…\nはふぅ～！\nトーゴクの文化はステキデスね～！', '15'),
    c(109701, 'レム', '17', '？？？', '鬼族', '154', '??', '2', '2', '?', '演劇鑑賞、詩文', '水瀬いのり', '鬼がかりの万能妹メイド', '', ''),
    c(109801, 'ラム', '17', '？？？', '鬼族', '154', '??', '2', '2', '?', '読書', '村川梨衣', '毒舌系鬼姉メイド', '', ''),
    c(109901, 'エミリア', '114', '？？？', 'ハーフエルフ', '164', '??', '9', '23', '?', 'パックの毛繕い、勉強', '高橋李依', '銀髪のおっとりハーフエルフ', '', ''),
    c(110001, 'スズナ（サマー）', '18', 'ルーセント学院', '魔族', '167', '48', '4', '10', 'O', 'ファッション', '上坂すみれ', '天真爛漫で人気者のカリスマモデル', 'ヒデサイ、ちょっす～！　うち、漢字と計算は\nちょっち…てか、おに苦手なんだ～\nでもでも、ファッションだったら任せて～！', '14'),
    c(110101, 'イオ（サマー）', '23', 'ルーセント学院', '魔族', '162', '52', '8', '14', 'B', '恋愛小説、恋愛舞台、恋愛漫画の鑑賞', '伊藤静', '多くの男性を魅了する無垢な女教師', 'いつも助けてくれてありがとう\n私のほうが年上なのに\n頼ってばかりでごめんなさい～', '14'),
    c(110301, 'サレン（サマー）', '17', 'サレンディア救護院', 'エルフ', '156', '43', '10', '4', 'A', '経営、お茶会', '堀江由衣', '救護院を経営する優しい庶民派お嬢様', '貧乏性？　いいえ、\n「もったいない」の精神で\n日々を過ごしてるだけよ！', '9'),
    c(110401, 'マコト（サマー）', '17', '自警団（カォン）', '獣人族', '168', '54', '8', '9', 'O', 'お菓子作り', '小松未可子', '男勝りで情に厚いワイルド娘', '腹へってたら言えよな\n簡単でよければ\nすっげー旨いもん食わせてやるよ！', '10'),
    c(110501, 'カオリ（サマー）', '19', '自警団（カォン）', '獣人族', '158', '53', '7', '7', 'A', '踊り、空手', '高森奈津美', 'いつでも「なんくるないさ～」な天然娘', 'ハイターイ！　歌って踊って、\n最高に盛り上がるさ～！\nやさやさ、キミも一緒に踊るさ～！', '10'),
    c(110601, 'マホ（サマー）', '16', '自警団（カォン）', '獣人族', '155', '42', '9', '22', 'O', '空想、ぬいぐるみ集め', '内田真礼', 'マホマホ王国のプリンセス', 'マホマホ王国のお姫はんの、マホ姫どす！\nけったいな顔してどないしはったん？\nマホマホ王国はずーっと遠くの国なんどす？', '10'),
    c(110701, 'アオイ（編入生）', '13', 'フォレスティエ', 'エルフ', '158', '44', '6', '6', 'AB', '友達作りのイメトレ', '花澤香菜', '「友達」に憧れる、エルフの森の女の子', '', '6'),
    c(110801, 'クロエ', '17', '聖テレサ女学院（なかよし部）', 'エルフ', '154', '42', '8', '7', 'O', 'ダーツ', '種﨑敦美', 'ダウンタウン育ちのダウナー系エルフ', '', '16'),
    c(110901, 'チエル', '16', '聖テレサ女学院（なかよし部）', 'ヒューマン', '156', '46', '9', '15', 'O', 'ダンス、カラオケ', '佐倉綾音', '自由奔放ナチュラル無礼な現代っ子', '', '16'),
    c(111001, 'ユニ', '18', '聖テレサ女学院（なかよし部）', 'ヒューマン', '142', '36', '2', '28', 'O', '読書', '小原好美', '書庫に眠れる小さな賢人', '', '16'),
    c(111101, 'キョウカ（ハロウィン）', '8', 'リトルリリカル', 'エルフ', '118', '21', '2', '2', 'A', 'お勉強', '小倉唯', '礼儀正しくしっかり者のちびっ子優等生', '', '5'),
    c(111201, 'ミソギ（ハロウィン）', '9', 'リトルリリカル', 'ヒューマン', '128', '27', '8', '10', 'O', 'いたずら、探検', '諸星すみれ', '探検好きのイタズラっ子', 'イタズラなら任せて！\nにいちゃん、引っかからないように気を付けなよー♪', '5'),
    c(111301, 'ミミ（ハロウィン）', '10', 'リトルリリカル', '獣人族', '117', '21', '4', '3', 'O', 'かわいいもの集め', '日高里菜', 'お歌もにんじんも、ウサギさんも大好き♪', 'ぴょんぴょん、うさぎさんになりたいな～♪　\nミミ、うさぎさんになれたら、\n最初におにいちゃんに見せてあげるね！', '5'),
    c(111401, 'ルナ', '??', '？？？', 'ヒューマン', '142', '28', '?', '?', '?', '「おともだち」を探すこと', '小倉唯', 'おともだちを探す死霊術師の少女', '', ''),
    c(111501, 'クリスティーナ（クリスマス）', '27', '王宮騎士団（NIGHTMARE）', 'ヒューマン', '165', '??', '2', '7', 'O', '強敵との闘争', 'たかはし智秋', '傍若無人な王宮騎士団副団長', '', '8'),
    c(111601, 'ノゾミ（クリスマス）', '17', 'カルミナ', 'ヒューマン', '157', '40', '1', '24', 'B', '舞台鑑賞、ダンス', '日笠陽子', '歌って踊れる大人気アイドル', '', '4'),
    c(111701, 'イリヤ（クリスマス）', '??', '悪魔偽王国軍（ディアボロス）', '魔族', '172', '50', '5', '5', 'A', '世界征服', '丹下桜', 'かつては夜を支配した最強の吸血鬼', '', '7'),
    c(111901, 'コッコロ（ニューイヤー）', '11', '美食殿', 'エルフ', '140', '35', '5', '11', 'B', '瞑想、動植物の飼育', '伊藤美来', '主を慕う、小さなガイド役', '主さまのガイド役を仰せつかりました\nわたくし、主さまに満足していただけるよう\n誠心誠意尽くさせていただきます', '1'),
    c(112001, 'キャル（ニューイヤー）', '14', '美食殿', '獣人族', '152', '39', '9', '2', 'A', '猫と遊ぶ', '立花理香', '行き倒れの謎のネコミミ魔法使い', 'なに、モタモタしてんのよ\n仕方ないから、あたしが手伝ってあげるわ\nいい？　感謝しなさいよね！', '1'),
    c(112101, 'スズメ（ニューイヤー）', '15', 'サレンディア救護院', 'ヒューマン', '154', '43', '12', '12', 'O', 'ご奉仕', '悠木碧', 'お嬢さまのためにがんばるドジっ娘メイド', 'うぅ…ごめんなさい～…\nまたキッチンを爆発させてしまいました～\nこれじゃあメイド失格です…', '9'),
    c(112201, 'カスミ（マジカル）', '18', '自警団（カォン）', '獣人族', '152', '41', '11', '3', 'AB', '読書、推理', '水瀬いのり', '頭脳明晰な美少女名探偵', '', '10'),
    c(112301, 'シオリ（マジカル）', '14', '牧場（エリザベスパーク）', '獣人族', '153', '40', '11', '3', 'A', '読書、お散歩', '小清水亜美', '読書が趣味の病弱少女', 'ゴホッ、ゴホッ…か、身体は弱いけど、\nせめて気持ちだけでも前向きに…！\nあっ、でもダメ…立ちくらみが…', '11'),
    c(112401, 'ウヅキ（デレマス）', '17', 'ニュージェネレーションズ', 'ヒューマン', '159', '45', '4', '24', 'O', '友達と長話', '大橋彩香', '弾ける笑顔！　アイドルを夢見る女の子', '', '100'),
    c(112501, 'リン（デレマス）', '15', 'ニュージェネレーションズ', 'ヒューマン', '165', '44', '8', '10', 'B', '犬の散歩', '福原綾香', 'クールビューティーな「蒼の剣士」', '', '100'),
    c(112601, 'ミオ（デレマス）', '15', 'ニュージェネレーションズ', 'ヒューマン', '161', '46', '12', '1', 'B', 'ショッピング', '原紗友里', 'スーパースターを目指す元気娘☆☆★', '', '100'),
    c(112701, 'リン（レンジャー）', '17', '牧場（エリザベスパーク）', '獣人族', '144', '42', '1', '1', 'B', 'あんパン', '小岩井ことり', '遊びと睡眠が何より大事なぐうたら娘', '', '11'),
    c(112801, 'マヒル（レンジャー）', '20', '牧場（エリザベスパーク）', 'ヒューマン', '142', '35', '3', '3', 'B', '漫才', '新田恵海', 'みんなを笑顔にするお笑い牧場主', 'オラはどんな時でもみんなに笑顔を届ける\n最高の芸人目指してる！\n一緒に頑張るべ！', '11'),
    c(112901, 'リノ（ワンダー）', '15', 'ラビリンス', 'ヒューマン', '156', '44', '8', '25', 'A', 'お裁縫', '阿澄佳奈', '人懐っこくてマシンガントークな妹系少女', '覚えていないと思うんですけど…\n私は妹なんですよ！\nだからお兄ちゃんって呼んでいいですか？', '3'),
    c(113001, 'アユミ（ワンダー）', '16', 'ヴァイスフリューゲル　ランドソル支部', 'エルフ', '155', '43', '4', '7', 'O', '観察', '大関英里', 'どこまでも一途に慕う、純情乙女', '', '15'),
    c(113101, 'ルカ（サマー）', '25', 'トワイライトキャラバン', 'ヒューマン', '167', '54', '7', '11', 'B', '釣り', '佐藤利奈', '人情味溢れる粋でいなせな「姉御」', '', '13'),
    c(113201, 'アンナ（サマー）', '17', 'トワイライトキャラバン', '魔族', '159', '45', '7', '5', 'A', '小説執筆', '髙野麻美', '前世を信じる中二病患者、「疾風の冥姫」', 'いいか、絶対に私を真名で呼ぶなよ？\n常に「機関」の眼や耳の存在を疑え\nそれが、生きのびるための術だ…！', '13'),
    c(113301, 'ナナカ（サマー）', '18', 'トワイライトキャラバン', '魔族', '166', '55', '8', '21', 'O', '読書、魔法', '佳村はるか', 'オタク全開な魔法少女', '', '13'),
    c(113401, 'ハツネ（サマー）', '17', 'フォレスティエ', 'エルフ', '156', '46', '12', '24', 'A', '妹と遊ぶこと、二度寝、昼寝、早寝', '大橋彩香', 'みんなのために超能力を使う眠り姫', '私はハツネ！　困っている人の味方だよ！\n困った時は、いつでも言ってね♪\n私のちょ…ま、魔法で助けてあげるから！', '6'),
    c(113501, 'ミサト（サマー）', '21', 'フォレスティエ', 'エルフ', '165', '54', '9', '5', 'O', '絵本作り', '國府田マリ子', '母性溢れる優しいみんなの「ミサト先生」', '', '6'),
    c(113601, 'ジュン（サマー）', '25', '王宮騎士団（NIGHTMARE）', 'ヒューマン', '171', '50', '10', '25', 'A', '格闘技、湯浴み', '川澄綾子', '素顔を見せない冷静沈着な女性騎士', '', '8'),
    c(113701, 'アカリ（エンジェル）', '13', '悪魔偽王国軍（ディアボロス）', '魔族', '150', '42', '11', '22', 'O', 'サックス', '浅倉杏美', '甘え上手なみんなの人気者', 'アカリ、まだわからないことが多くて…\nだからこれから\nいろいろ教えてくださいね、お兄ちゃん！', '7'),
    c(113801, 'ヨリ（エンジェル）', '13', '悪魔偽王国軍（ディアボロス）', '魔族', '150', '40', '11', '22', 'O', 'ゲーム全般', '原紗友里', '人見知りであまのじゃくな女の子', 'え、えっと…こ、こういうときって、\nどういうことを言えばいいんだっけ…\nうう、どうしてちゃんと喋れないの…', '7'),
    c(113901, 'ツムギ（ハロウィン）', '14', 'カルミナ', 'ヒューマン', '153', '45', '9', '7', 'AB', '裁縫', '木戸衣吹', 'ファッション大好きなキュートガール', '', '4'),
    c(114001, 'レイ（ハロウィン）', '18', 'トゥインクルウィッシュ', '魔族', '163', '46', '1', '12', 'B', '読書、乗馬、お茶', '早見沙織', 'クールで何事にも真っ直ぐな剣士', 'キミと会ったのもきっと何かの縁だ\n一緒に塔の頂上を目指す仲間として\n頑張っていこう。よろしく頼む', '2'),
    c(114101, 'マツリ（ハロウィン）', '12', '王宮騎士団（NIGHTMARE）', '獣人族', '146', '40', '11', '25', 'O', 'ヒーローごっこ', '下田麻美', 'ヒーローに憧れる騎士見習いの少女', '', '8'),
    c(114201, 'モニカ（マジカル）', '18', 'ヴァイスフリューゲル　ランドソル支部', 'ヒューマン', '140', '33', '7', '28', 'A', 'お菓子屋通い', '辻あゆみ', '見た目も中身もお子ちゃまな異国の軍人', '「白き翼」こと、ヴァイスフリューゲル…\nその名に恥じぬよう、天高く舞い、\n華麗に敵を倒してみせる！', '15'),
    c(114301, 'トモ（マジカル）', '13', '王宮騎士団（NIGHTMARE）', 'ヒューマン', '149', '43', '8', '11', 'A', '剣術、年長者をからかう', '茅原実里', '義理堅くてからかい好きな剣術少女', '', '8'),
    c(114401, 'アキノ（クリスマス）', '18', 'メルクリウス財団', 'ヒューマン', '157', '45', '3', '12', 'AB', '慈善事業', '松嵜麗', '一人前の商人を目指すパワフルお嬢様', 'この私とともにいる限り、\nお金に不自由はさせませんわ！', '12'),
    c(114501, 'サレン（クリスマス）', '17', 'サレンディア救護院', 'エルフ', '156', '43', '10', '4', 'A', '経営、お茶会', '堀江由衣', '救護院を経営する優しい庶民派お嬢様', '貧乏性？　いいえ、\n「もったいない」の精神で\n日々を過ごしてるだけよ！', '9'),
    c(114601, 'ユカリ（クリスマス）', '22', 'メルクリウス財団', 'エルフ', '164', '55', '3', '16', 'A', 'ウインドーショッピング', '今井麻美', '純情でほっとけない大人の女性', 'キミには情けないところばかり\n見られているけど、こんなところ、\nキミ以外には見せないんだからね？', '12'),
    c(180201, 'ユイ（プリンセス）', '17', 'トゥインクルウィッシュ', 'ヒューマン', '158', '47', '4', '5', 'O', '料理、人間観察', '種田梨沙', '戦闘のサポートが得意な、心優しい少女', 'あんまり役に立てるかはわからないけど…\nわたしも頑張って、\nみんなをサポートするね！', '2'),
    c(180401, 'ぺコリーヌ（プリンセス）', '17', '美食殿', 'ヒューマン', '156', '46', '3', '31', 'O', '食べ歩き、料理', 'M・A・O', 'いつも元気な腹ペコ少女', 'あ、あの…何か食べ物持っていませんか？\nもう、お腹ペコペコで…', '1'),
    c(180501, 'コッコロ（プリンセス）', '11', '美食殿', 'エルフ', '140', '35', '5', '11', 'B', '瞑想、動植物の飼育', '伊藤美来', '主を慕う、小さなガイド役', '主さまのガイド役を仰せつかりました\nわたくし、主さまに満足していただけるよう\n誠心誠意尽くさせていただきます', '1')
  ];
})();
