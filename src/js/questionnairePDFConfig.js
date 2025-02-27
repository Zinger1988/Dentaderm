function createQuestionnairePDFConfig(questionnaireData) {
  console.log(questionnaireData);

  return {
    header: (currentPage, pageCount) => [
      {
        absolutePosition: { x: 0, y: 30 },
        columns: [
          {
            svg: `
			<svg  width="62" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					viewBox="0 0 94 72" style="enable-background:new 0 0 94 72;" xml:space="preserve">
			<path d="M46.1,34.2l0.8,2.1h-1.7L46.1,34.2L46.1,34.2z M69.5,34.9c0-0.3-0.1-0.5-0.3-0.6c-0.2-0.1-0.4-0.2-0.7-0.2h-1.2v1.7h1.1
				c0.3,0,0.6-0.1,0.7-0.2C69.4,35.4,69.5,35.2,69.5,34.9z M75.7,65.4c-17.3,11.3-40.1,7.7-53.2-7.7c-1.8-2.1-4.9-2.6-7.3-1.1l-3.7,2.4
				c-2.8,1.8-6.7,0.8-8-2.3C-4.5,39,1.4,17.6,18.3,6.6c17.3-11.3,40.1-7.7,53.2,7.7c1.8,2.1,4.9,2.6,7.3,1.1l3.7-2.4
				c2.8-1.8,6.7-0.8,8,2.3C98.5,32.9,92.6,54.4,75.7,65.4z M18.5,35.6c0-0.3,0-0.6-0.1-0.9c-0.1-0.3-0.3-0.5-0.5-0.7
				c-0.2-0.2-0.4-0.3-0.7-0.4c-0.3-0.1-0.6-0.1-0.9-0.2h-1.5v4.2h1.5c0.3,0,0.6,0,0.9-0.1c0.3-0.1,0.5-0.3,0.7-0.4
				c0.2-0.2,0.3-0.4,0.5-0.7C18.4,36.2,18.5,35.9,18.5,35.6z M25.5,37.2H23v-1.4h2.2v-0.5H23v-1.2h2.4v-0.5h-3.1v4.2h3.2V37.2z
				M33.2,33.5h-0.6v3.3L30,33.5h-0.6v4.2h0.6v-3.2l2.5,3.2h0.6V33.5z M40.8,33.5H37v0.6h1.6v3.7h0.6v-3.7h1.6V33.5z M48.2,37.8
				l-1.8-4.2h-0.8l-1.8,4.2h0.7l0.4-1h2.2l0.4,1H48.2z M55.8,35.6c0-0.3,0-0.6-0.1-0.9c-0.1-0.3-0.3-0.5-0.5-0.7
				c-0.2-0.2-0.4-0.3-0.7-0.4c-0.3-0.1-0.6-0.1-1-0.2H52v4.2h1.5c0.3,0,0.6,0,0.9-0.1c0.3-0.1,0.5-0.3,0.7-0.4c0.2-0.2,0.3-0.4,0.5-0.7
				C55.7,36.2,55.8,35.9,55.8,35.6z M62.9,37.2h-2.6v-1.4h2.2v-0.5h-2.2v-1.2h2.4v-0.5h-3.1v4.2h3.2V37.2z M70.3,37.7l-1.1-1.6
				c0.3-0.1,0.5-0.2,0.7-0.5c0.2-0.2,0.3-0.5,0.3-0.8c0-0.2,0-0.4-0.1-0.6c-0.1-0.2-0.2-0.3-0.3-0.4c-0.1-0.1-0.3-0.2-0.5-0.3
				c-0.2-0.1-0.4-0.1-0.7-0.1h-1.8v4.2h0.7v-1.4h1.2l1,1.4H70.3z M78.5,33.5h-0.7l-1.5,2.2l-1.4-2.2h-0.7v4.2h0.6v-3.3h0.1l1.3,2h0.3
				l1.3-2h0.1v3.3h0.6V33.5z M53.5,34.1h-0.8v3.1h0.8v0c0.2,0,0.5,0,0.7-0.1c0.2-0.1,0.4-0.2,0.5-0.3c0.1-0.1,0.3-0.3,0.3-0.5
				c0.1-0.2,0.1-0.4,0.1-0.7c0-0.5-0.1-0.9-0.4-1.2C54.5,34.2,54,34.1,53.5,34.1z M16.2,34.1h-0.8v3.1h0.8v0c0.2,0,0.5,0,0.7-0.1
				c0.2-0.1,0.4-0.2,0.5-0.3c0.1-0.1,0.3-0.3,0.3-0.5s0.1-0.4,0.1-0.7c0-0.5-0.1-0.9-0.4-1.2C17.1,34.2,16.7,34.1,16.2,34.1z"/>
			</svg>
		`,
            margin: [40, -10, 0, 0],
          },
          {
            text: [
              "вул. Вишгородська/Полярна 56/2 (літера А), прим. 110, м. Київ\n",
              "вул. Кловський узвіз, буд. 7 (літера А), м. Київ\n",
              "вул. Соборна, 107, прим. 37, м. Ірпінь, Київська обл.\n",
              "+38 (097) 420-30-30\n",
              "info@dentaderm.ua\n",
              "https://www.dentaderm.ua",
            ],
            style: "headerRight",
          },
        ],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 40,
            y1: 90,
            x2: 555,
            y2: 90,
            lineWidth: 1,
            color: "gray",
          },
        ],
      },
    ],
    footer: (currentPage, pageCount) => [
      {
        canvas: [
          {
            type: "line",
            x1: 40,
            y1: 0,
            x2: 555,
            y2: 0,
            lineWidth: 1,
            color: "gray",
          },
        ],
      },
      {
        margin: [0, 5, 0, 0],
        columns: [
          {
            text: `© Dentaderm ${new Date().getFullYear()}`,
            style: ["footerLeft", "fontSmall"],
          },
          {
            text: `Сторінка ${currentPage} з ${pageCount}`,
            style: ["footerRight", "fontSmall"],
          },
        ],
      },
    ],
    pageMargins: [40, 110, 40, 40],
    content: [
      { text: "Візитна картка пацієнта", style: ["header1", "textCenter"] },
      {
        text: ["Я, ", { text: "Гайворон Олена Павлівна", style: "italic" }],
        style: "paragraph",
      },
      {
        text: [
          "Дата та рік народження: ",
          { text: "18-06-1990, ", style: "italic" },
          "адреса проживання: ",
          { text: "Київ, вул.Ольги Кобилянської, 28", style: "italic" },
        ],
        style: "paragraph",
      },
      {
        text: [
          "Контактний телефон: ",
          {
            text: "0931297129, ",
            link: "tel:+380931297129",
            style: ["italic"],
          },
          "email: ",
          {
            text: "dama.cherv@gmail.com",
            link: "mailto:dama.cherv@gmail.com",
            style: "italic",
          },
        ],
        style: "paragraph",
      },
      {
        text: [
          "Прізвище, ініціали законного представника (для пацієнтів до 18 років): ",
          { text: "Гайворон Павло Олегович, ", style: "italic" },
        ],
        style: "paragraph",
      },
      {
        text: "надаю добровільну згоду на:",
        style: ["paragraph", "bold"],
      },
      {
        style: "list",
        ul: [
          {
            text: 'проведення обстеження і діагностики (рентгенодіагностика, фото- та відеодіагностика, діагностика тканин пародонту із застосуванням інфільтраційної анестезії (за потребою), апаратурна діагностика тощо) мене або моєї дитини з подальшим виготовленням діагностичної моделі та складанням плану лікування; відеозйомку із аудіозаписом із збереженням результатів, які проводяться за допомогою камер відеоспостереження на території ПП "Дента Дерм", ТОВ "Дента-Д". Збір, обробка, використання та зберігання моїх персональних даних персоналом ПП "Дента Дерм", ТОВ "Дента-Д" здійснюються в цілях охорони здоров’я, для забезпечення лікування і надання медичних послуг та в цілях охорони як допоміжний засіб запобігання протиправним діям;',
            style: "listItem",
          },
          {
            text: 'використання фото- та відеорезультатів мого лікування для комунікації між медичними та іншими працівниками ПП "Дента Дерм", ТОВ "Дента-Д" в лікувальних та інших цілях; відправлення мені на ознайомлення планів лікування та/або інших документів медичного характеру у будь-який месенджер (Telegram, Viber, WhatsApp), прив’язаний до мого номеру телефону;',
            style: "listItem",
          },
          {
            text: "лікування під час встановленого в Україні режиму воєнного стану та карантину у зв’язку із пандеміями та епідеміями. Я розумію та погоджуюся, що через застосування вищезазначених обмежувальних заходів, а також особливий режим роботи та обслуговування пацієнтів, існує ймовірність, що я не зможу отримати стоматологічну допомогу у повному обсязі, але я все одно надаю свою згоду на проведення лікування.",
            style: "listItem",
          },
        ],
      },
      {
        text: "Своїм власним підписом я також підтверджую факт ознайомлення з наступними документами правового характеру, які знаходяться в Куточку споживача:",
        style: ["paragraph", "bold"],
      },
      {
        style: "list",
        ul: [
          {
            text: 'Публічний договір-оферта про надання медичних стоматологічних послуг, затверджений Наказом директора ПП "Дента Дерм" від 01.09.2023 р. №1-МЗ, Наказом директора ТОВ "Дента-Д" від 02.10.2023 р. №1-МЗ;',
            style: "listItem",
          },
          {
            text: 'Перелік та вартість послуг (Прейскурант) ПП "Дента Дерм", ТОВ "Дента-Д";',
            style: "listItem",
          },
          {
            text: 'Правила внутрішнього розпорядку (перебування та обслуговування пацієнтів) в Медичному центрі ПП "Дента Дерм", затвердженіНаказом директора ПП "Дента Дерм" від 01.09.2023 р. №2-МЗ, Наказом директора ТОВ "Дента-Д" від 02.10.2023 р. №2-МЗ;',
            style: "listItem",
          },
          {
            text: 'Положення про гарантійні зобов’язання Медичного центру ПП "Дента Дерм", затверджене Наказом директора від 01.09.2023 р.№1-МЗ, Медичного центру ТОВ "Дента-Д", затверджене Наказом директора ТОВ "Дента-Д" від 02.10.2023 р. №2-МЗ',
            style: "listItem",
          },
          {
            text: 'Основні споживчі властивості на основні стоматологічні послуги Медичного центру ПП "Дента Дерм", затверджені Наказом директора від 01.09.2023 р. №2-МЗ, Медичного центру ТОВ "Дента-Д", затверджені Наказом директора від 02.10.2023 р. № 2-МЗ.',
            style: "listItem",
          },
        ],
      },
      {
        text: "Дата   _________________________________________________",
        style: "signatureText",
        margin: [10, 25, 0, 14],
      },
      {
        text: "Підпис пацієнта   ______________________________________",
        style: "signatureText",
        margin: [10, 10, 0, 20],
      },
      { text: "", pageBreak: "before" },
      { text: "Анкета про стан здоров'я", style: ["header1", "textCenter"] },
      { text: "Гайворон Олена Павлівна", style: ["header2", "textCenter"] },
      { text: "Серцево-судинноі захворювання", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Чи маєте Ви підвищений / понижений тиск?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Який саме",
                style: ["fontSmall", "cell"],
              },
              {
                text: "180/160",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви кардіостимулятор?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви захворювання серця, порушення серцевого ритму?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви вроджені вади серця?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви в анамнезі перенесені інфаркт / інсульт?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        text: "Чи Ви хворієте або хворіли наступними хворобами:",
        style: "header2",
      },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Цукровий діабет",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання крові (тривалі кровотечі, незгортання крові, анемія тощо)",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання очей (глаукома, відшарування сітківки тощо)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Онкологічні захворювання",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання дихальної системи",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Нервові захворювання",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання печінки",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Ревматизм, артрит, болі в суглобах, суглобове протезування",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання щитоподібної залози",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання нирок",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання шлунково-кишкового тракту",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Туберкульоз",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Гепатит (жовтяниця) А, В, С. (Зазначте який тип та рік захворювання)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Тип гепатиту",
                style: ["fontSmall", "cell"],
              },
              {
                text: "А",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "СНІД (AIDS)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Герпетичні ураження губ",
                style: ["fontSmall", "cell"],
              },
              {
                text: "А",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Скільки разів на рік?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "1",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Захворювання шкіри (псоріаз, екзема, невідомого походження, тощо)",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Чи були у Вас напади епілепсії?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи приймаєте Ви ліки, що покращують / погіршують згортання крові?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи приймаєте Ви будь-які інші медикаменти?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви непереносимість до окремих ліків?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи Ви палите?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи Ви вживаєте міцні алкогольні напої частіше двох разів на тиждень?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи вживаєте Ви наркотичні речовини?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи вживаєте Ви психотропні речовини, в т.ч. транквілізатори, антидепресанти?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте наразі будь-які інші захворювання?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи були у Вас або маєте неприємні відчуття в суглобах нижньої щелепи? (Якщо так, то оберіть, які саме: біль / клацання / шум / інший дискомфорт)",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи були Ви оперовані?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "інтубація була проведена через:",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Рот",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте Ви шкідливі звички, пов’язані із зубами (гризете олівці, ручки, губи, щоки, нігті, скрегіт або надмірне стискання зубів)?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи відчували Ви самовільні больові відчуття в зубах, які через деякий час проходили без звернення до лікаря-стоматолога?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Стосується тільки жінок:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Ви вагітні? (Якщо так, то вкажіть термін)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Строк вагітності",
                style: ["fontSmall", "cell"],
              },
              {
                text: "24 тиж",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи годуєте Ви груддю?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи маєте розлади меноциклу, в т.ч. клімакс, менопауза?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Чи приймаєте Ви пероральні контрацептиви?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Протягом якого часу?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "1 міс",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        text: "Алергологічний анамнез (згідно з Наказом МОЗ України від 30.12.2015 № 916). Чи скаржитеся Ви на:",
        style: "header2",
      },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Напади ядухи (задишка, спричинювана деякими захворюваннями серця або бронхів; астма)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Задишки чи тяжкого дихання",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Задушливого кашлю",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Періодичні хрипи (свисти), які чути на відстані",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Часту чи постійну закладеність носа",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Виділення з носа без простуди",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Висипи на шкірі",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Почервоніння шкіри",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Набряки шкіри",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Відчуття свербежу шкіри",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Болі у животі",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Нудота",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Алергічний дерматит",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Часті діареї",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Втрата свідомості",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Помітне різке зниження артеріального тиску",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Затруднення дихання",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "В який період виникають скарги?",
                style: ["fontSmall", "cell"],
              },
              {
                text: "Цілорічно",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Чи скаржитеся Ви на:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Свербіння та / або почервоніння очей",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Свербіння та / або почервоніння повік",
                style: ["fontSmall", "cell"],
              },
              {
                text: "24 тиж",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Свербіння та / або почервоніння носа",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Усі вищенаведені скарги виникають після:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Застосування ЛЗ (лікарських засобів)",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Харчових продуктів",
                style: ["fontSmall", "cell"],
              },
              {
                text: "24 тиж",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Побутової хімії",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Контакту з різними речовинами на виробництві",
                style: ["fontSmall", "cell"],
              },
              {
                text: "24 тиж",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "інші речовини",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "У Вас раніше були виявлені:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Бронхіальна астма",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Алергічний риніт",
                style: ["fontSmall", "cell"],
              },
              {
                text: "24 тиж",
                style: ["bold", "fontSmall", "cell"],
              },
            ],
            [
              {
                text: "Небезпечні реакції на укуси комах",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Непереносимість харчових продуктів:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: "Чи існують харчові продукти, харчові домішки, які Ви не переносите?",
                style: ["cellGray100", "fontSmall", "cell"],
              },
              {
                text: "Так",
                style: ["cellGray100", "bold", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      { text: "Інші скарги:", style: "header2" },
      {
        style: "table",
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "Тут мають бути інші скарги",
                style: ["cellGray100", "fontSmall", "cell"],
              },
            ],
          ],
        },
      },
      {
        text: "Дата   _________________________________________________",
        style: "signatureText",
        margin: [0, 25, 0, 14],
      },
      {
        text: "Підпис пацієнта   ______________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 20],
      },
      {
        text: "Лікарі, які ознайомлені з анамнезом пацієнта:",
        style: "header2",
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 18, 0, 16],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 14],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 14],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 10, 0, 14],
      },
      {
        text: "Прізвище, ініціали, підпис   ________________________________________________________________________________________________________________________________",
        style: "signatureText",
        margin: [0, 14, 0, 0],
      },
    ],
    styles: {
      header1: {
        fontSize: 13,
        bold: true,
        margin: [0, 0, 0, 14],
      },
      header2: {
        fontSize: 11,
        bold: true,
        margin: [0, 5, 0, 5],
      },
      paragraph: {
        fontSize: 8,
        margin: [0, 0, 0, 12],
      },
      textCenter: {
        alignment: "center",
      },
      list: {
        margin: [0, 0, 0, 12],
      },
      listItem: {
        fontSize: 8,
        margin: [0, 0, 0, 6],
      },
      signatureLine: {
        margin: [60, 0, 60, 0],
      },
      signatureText: {
        fontSize: 7,
        italics: true,
      },
      spacer: {
        fontSize: 8,
        margin: [0, 8, 0, 0],
      },
      table: {
        margin: [0, 4, 0, 12],
      },
      cellGray100: {
        fillColor: "#e9e9e9",
      },
      cellHead: {
        fillColor: "#555",
        color: "white",
        margin: [2, 2, 2, 2],
      },
      cell: {
        margin: [2, 1, 2, 1],
      },
      fontSmall: {
        fontSize: 7,
      },
      bold: {
        bold: true,
      },
      italic: {
        italics: true,
      },
      footer: {
        border: [false, true, false, false],
        borderColor: "#000000",
      },
      footerLeft: {
        italics: true,
        alignment: "left",
        margin: [40, 0, 0, 0],
      },
      footerRight: {
        alignment: "right",
        margin: [0, 0, 40, 0],
        color: "gray",
      },
      headerLeft: {
        alignment: "left",
        margin: [40, 0, 0, 0],
      },
      headerRight: {
        alignment: "right",
        margin: [0, 0, 40, 0],
        fontSize: 7,
      },
    },
  };
}
