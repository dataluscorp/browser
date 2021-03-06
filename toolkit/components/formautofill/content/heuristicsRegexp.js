/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * Form Autofill field Heuristics RegExp.
 */

/* exported HeuristicsRegExp */

"use strict";

var HeuristicsRegExp = {
  RULES: {
    email: undefined,
    tel: undefined,
    organization: undefined,
    "street-address": undefined,
    "address-line1": undefined,
    "address-line2": undefined,
    "address-line3": undefined,
    "address-level2": undefined,
    "address-level1": undefined,
    "postal-code": undefined,
    country: undefined,
    // Note: We place the `cc-name` field for Credit Card first, because
    // it is more specific than the `name` field below and we want to check
    // for it before we catch the more generic one.
    "cc-name": undefined,
    name: undefined,
    "given-name": undefined,
    "additional-name": undefined,
    "family-name": undefined,
    "cc-number": undefined,
    "cc-exp-month": undefined,
    "cc-exp-year": undefined,
    "cc-exp": undefined,
    "cc-type": undefined,
  },

  RULE_SETS: [
    //=========================================================================
    // Datalus-specific rules
    {
      "address-line1": "addrline1|address_1",
      "address-line2": "addrline2|address_2",
      "address-line3": "addrline3|address_3",
      "address-level1": "land", // de-DE
      "additional-name": "apellido.?materno|lastlastname",
      "cc-name": "titulaire", // fr-FR
      "cc-number": "(cc|kk)nr", // de-DE
      "cc-exp-month": "(cc|kk)month", // de-DE
      "cc-exp-year": "(cc|kk)year", // de-DE
      "cc-type": "type",
    },

    //=========================================================================
    // These are the rules used by Bitwarden [0], converted into RegExp form.
    // [0] https://github.com/bitwarden/browser/blob/c2b8802201fac5e292d55d5caf3f1f78088d823c/src/services/autofill.service.ts#L436
    {
      email: "(^e-?mail$)|(^email-?address$)",

      tel:
        "(^phone$)" +
        "|(^mobile$)" +
        "|(^mobile-?phone$)" +
        "|(^tel$)" +
        "|(^telephone$)" +
        "|(^phone-?number$)",

      organization:
        "(^company$)" +
        "|(^company-?name$)" +
        "|(^organization$)" +
        "|(^organization-?name$)",

      "street-address":
        "(^address$)" +
        "|(^street-?address$)" +
        "|(^addr$)" +
        "|(^street$)" +
        "|(^mailing-?addr(ess)?$)" + // Modified to not grab lines, below
        "|(^billing-?addr(ess)?$)" + // Modified to not grab lines, below
        "|(^mail-?addr(ess)?$)" + // Modified to not grab lines, below
        "|(^bill-?addr(ess)?$)", // Modified to not grab lines, below

      "address-line1":
        "(^address-?1$)" +
        "|(^address-?line-?1$)" +
        "|(^addr-?1$)" +
        "|(^street-?1$)",

      "address-line2":
        "(^address-?2$)" +
        "|(^address-?line-?2$)" +
        "|(^addr-?2$)" +
        "|(^street-?2$)",

      "address-line3":
        "(^address-?3$)" +
        "|(^address-?line-?3$)" +
        "|(^addr-?3$)" +
        "|(^street-?3$)",

      "address-level2":
        "(^city$)" +
        "|(^town$)" +
        "|(^address-?level-?2$)" +
        "|(^address-?city$)" +
        "|(^address-?town$)",

      "address-level1":
        "(^state$)" +
        "|(^province$)" +
        "|(^provence$)" +
        "|(^address-?level-?1$)" +
        "|(^address-?state$)" +
        "|(^address-?province$)",

      "postal-code":
        "(^postal$)" +
        "|(^zip$)" +
        "|(^zip2$)" +
        "|(^zip-?code$)" +
        "|(^postal-?code$)" +
        "|(^post-?code$)" +
        "|(^address-?zip$)" +
        "|(^address-?postal$)" +
        "|(^address-?code$)" +
        "|(^address-?postal-?code$)" +
        "|(^address-?zip-?code$)",

      country:
        "(^country$)" +
        "|(^country-?code$)" +
        "|(^country-?name$)" +
        "|(^address-?country$)" +
        "|(^address-?country-?name$)" +
        "|(^address-?country-?code$)",

      name: "(^name$)|full-?name|your-?name",

      "given-name":
        "(^f-?name$)" +
        "|(^first-?name$)" +
        "|(^given-?name$)" +
        "|(^first-?n$)",

      "additional-name":
        "(^m-?name$)" +
        "|(^middle-?name$)" +
        "|(^additional-?name$)" +
        "|(^middle-?initial$)" +
        "|(^middle-?n$)" +
        "|(^middle-?i$)",

      "family-name":
        "(^l-?name$)" +
        "|(^last-?name$)" +
        "|(^s-?name$)" +
        "|(^surname$)" +
        "|(^family-?name$)" +
        "|(^family-?n$)" +
        "|(^last-?n$)",

      "cc-name":
        "cc-?name" +
        "|card-?name" +
        "|cardholder-?name" +
        "|cardholder" +
        // "|(^name$)" + // Removed to avoid overwriting "name", above.
        "|(^nom$)",

      "cc-number":
        "cc-?number" +
        "|cc-?num" +
        "|card-?number" +
        "|card-?num" +
        "|(^number$)" +
        "|(^cc$)" +
        "|cc-?no" +
        "|card-?no" +
        "|(^credit-?card$)" +
        "|numero-?carte" +
        "|(^carte$)" +
        "|(^carte-?credit$)" +
        "|num-?carte" +
        "|cb-?num",

      "cc-exp":
        "(^cc-?exp$)" +
        "|(^card-?exp$)" +
        "|(^cc-?expiration$)" +
        "|(^card-?expiration$)" +
        "|(^cc-?ex$)" +
        "|(^card-?ex$)" +
        "|(^card-?expire$)" +
        "|(^card-?expiry$)" +
        "|(^validite$)" +
        "|(^expiration$)" +
        "|(^expiry$)" +
        "|mm-?yy" +
        "|mm-?yyyy" +
        "|yy-?mm" +
        "|yyyy-?mm" +
        "|expiration-?date" +
        "|payment-?card-?expiration" +
        "|(^payment-?cc-?date$)",

      "cc-exp-month":
        "(^exp-?month$)" +
        "|(^cc-?exp-?month$)" +
        "|(^cc-?month$)" +
        "|(^card-?month$)" +
        "|(^cc-?mo$)" +
        "|(^card-?mo$)" +
        "|(^exp-?mo$)" +
        "|(^card-?exp-?mo$)" +
        "|(^cc-?exp-?mo$)" +
        "|(^card-?expiration-?month$)" +
        "|(^expiration-?month$)" +
        "|(^cc-?mm$)" +
        "|(^cc-?m$)" +
        "|(^card-?mm$)" +
        "|(^card-?m$)" +
        "|(^card-?exp-?mm$)" +
        "|(^cc-?exp-?mm$)" +
        "|(^exp-?mm$)" +
        "|(^exp-?m$)" +
        "|(^expire-?month$)" +
        "|(^expire-?mo$)" +
        "|(^expiry-?month$)" +
        "|(^expiry-?mo$)" +
        "|(^card-?expire-?month$)" +
        "|(^card-?expire-?mo$)" +
        "|(^card-?expiry-?month$)" +
        "|(^card-?expiry-?mo$)" +
        "|(^mois-?validite$)" +
        "|(^mois-?expiration$)" +
        "|(^m-?validite$)" +
        "|(^m-?expiration$)" +
        "|(^expiry-?date-?field-?month$)" +
        "|(^expiration-?date-?month$)" +
        "|(^expiration-?date-?mm$)" +
        "|(^exp-?mon$)" +
        "|(^validity-?mo$)" +
        "|(^exp-?date-?mo$)" +
        "|(^cb-?date-?mois$)" +
        "|(^date-?m$)",

      "cc-exp-year":
        "(^exp-?year$)" +
        "|(^cc-?exp-?year$)" +
        "|(^cc-?year$)" +
        "|(^card-?year$)" +
        "|(^cc-?yr$)" +
        "|(^card-?yr$)" +
        "|(^exp-?yr$)" +
        "|(^card-?exp-?yr$)" +
        "|(^cc-?exp-?yr$)" +
        "|(^card-?expiration-?year$)" +
        "|(^expiration-?year$)" +
        "|(^cc-?yy$)" +
        "|(^cc-?y$)" +
        "|(^card-?yy$)" +
        "|(^card-?y$)" +
        "|(^card-?exp-?yy$)" +
        "|(^cc-?exp-?yy$)" +
        "|(^exp-?yy$)" +
        "|(^exp-?y$)" +
        "|(^cc-?yyyy$)" +
        "|(^card-?yyyy$)" +
        "|(^card-?exp-?yyyy$)" +
        "|(^cc-?exp-?yyyy$)" +
        "|(^expire-?year$)" +
        "|(^expire-?yr$)" +
        "|(^expiry-?year$)" +
        "|(^expiry-?yr$)" +
        "|(^card-?expire-?year$)" +
        "|(^card-?expire-?yr$)" +
        "|(^card-?expiry-?year$)" +
        "|(^card-?expiry-?yr$)" +
        "|(^an-?validite$)" +
        "|(^an-?expiration$)" +
        "|(^annee-?validite$)" +
        "|(^annee-?expiration$)" +
        "|(^expiry-?date-?field-?year$)" +
        "|(^expiration-?date-?year$)" +
        "|(^cb-?date-?ann$)" +
        "|(^expiration-?date-?yy$)" +
        "|(^expiration-?date-?yyyy$)" +
        "|(^validity-?year$)" +
        "|(^exp-?date-?year$)" +
        "|(^date-?y$)",

      "cc-type":
        "(^cc-?type$)" +
        "|(^card-?type$)" +
        "|(^card-?brand$)" +
        "|(^cc-?brand$)" +
        "|(^cb-?type$)",
    },

    //=========================================================================
    // These rules are from Chromium source codes [1]. Most of them
    // converted to JS format have the same meaning with the original ones except
    // the first line of "address-level1".
    // [1] https://source.chromium.org/chromium/chromium/src/+/master:components/autofill/core/common/autofill_regex_constants.cc
    {
      // ==== Email ====
      email:
        "e.?mail" +
        "|courriel" + // fr
        "|correo.*electr(o|??)nico" + // es-ES
        "|?????????????????????" + // ja-JP
        "|??????????????????????.???????????" + // ru
        "|??????|??????" + // zh-CN
        "|????????????" + // zh-TW
        "|???-?????????????????????|????????????????????????????????????.?" +
        "???????????????" + // ml
        "|??????????|??????.*??????????????????" + // fa
        "|????????????|????????????????????????????????????.??????????" + // hi
        "|(\\b|_)eposta(\\b|_)" + // tr
        "|(?:?????????|??????.???????|[Ee]-?mail)(.???????)?", // ko-KR

      // ==== Telephone ====
      tel:
        "phone|mobile|contact.?number" +
        "|telefonnummer" + // de-DE
        "|telefono|tel??fono" + // es
        "|telfixe" + // fr-FR
        "|??????" + // ja-JP
        "|telefone|telemovel" + // pt-BR, pt-PT
        "|??????????????" + // ru
        "|??????????????????" + // hi for mobile
        "|(\\b|_|\\*)telefon(\\b|_|\\*)" + // tr
        "|??????" + // zh-CN
        "|?????????????????????" + // ml for mobile
        "|(?:??????|?????????|?????????|????????????)(?:.???????)?", // ko-KR

      // ==== Address Fields ====
      organization:
        "company|business|organization|organisation" +
        "|(?<!con)firma|firmenname" + // de-DE
        "|empresa" + // es
        "|societe|soci??t??" + // fr-FR
        "|ragione.?sociale" + // it-IT
        "|??????" + // ja-JP
        "|????????????????.?????????????????" + // ru
        "|??????|??????" + // zh-CN
        "|????????" + // fa
        "|??????|??????", // ko-KR

      "street-address": "streetaddress|street-address",

      "address-line1":
        "^address$|address[_-]?line(one)?|address1|addr1|street" +
        "|(?:shipping|billing)address$" +
        "|strasse|stra??e|hausnummer|housenumber" + // de-DE
        "|house.?name" + // en-GB
        "|direccion|direcci??n" + // es
        "|adresse" + // fr-FR
        "|indirizzo" + // it-IT
        "|^??????$|??????1" + // ja-JP
        "|morada|((?<!identifica????o do )endere??o)" + // pt-BR, pt-PT
        "|??????????" + // ru
        "|??????" + // zh-CN
        "|(\\b|_)adres(?! (ba??l??????(n??z)?|tarifi))(\\b|_)" + // tr
        "|^??????.?$|??????.?1", // ko-KR

      "address-line2":
        "address[_-]?line(2|two)|address2|addr2|street|suite|unit(?!e)" + // Datalus adds `(?!e)` to unit to skip `United State`
        "|adresszusatz|erg??nzende.?angaben" + // de-DE
        "|direccion2|colonia|adicional" + // es
        "|addresssuppl|complementnom|appartement" + // fr-FR
        "|indirizzo2" + // it-IT
        "|??????2" + // ja-JP
        "|complemento|addrcomplement" + // pt-BR, pt-PT
        "|??????????" + // ru
        "|??????2" + // zh-CN
        "|??????.?2", // ko-KR

      "address-line3":
        "address[_-]?line(3|three)|address3|addr3|street|suite|unit(?!e)" + // Datalus adds `(?!e)` to unit to skip `United State`
        "|adresszusatz|erg??nzende.?angaben" + // de-DE
        "|direccion3|colonia|adicional" + // es
        "|addresssuppl|complementnom|appartement" + // fr-FR
        "|indirizzo3" + // it-IT
        "|??????3" + // ja-JP
        "|complemento|addrcomplement" + // pt-BR, pt-PT
        "|??????????" + // ru
        "|??????3" + // zh-CN
        "|??????.?3", // ko-KR

      "address-level2":
        "city|town" +
        "|\\bort\\b|stadt" + // de-DE
        "|suburb" + // en-AU
        "|ciudad|provincia|localidad|poblacion" + // es
        "|ville|commune" + // fr-FR
        "|localita" + // it-IT
        "|????????????" + // ja-JP
        "|cidade" + // pt-BR, pt-PT
        "|??????????" + // ru
        "|???" + // zh-CN
        "|??????" + // zh-TW
        "|??????" + // fa
        "|?????????" + // hi for city
        "|???????????????|????????????" + // hi for village
        "|????????????|??????????????????" + // ml for town|village
        "|((\\b|_|\\*)([??ii??]l[c??]e(miz|niz)?)(\\b|_|\\*))" + // tr
        "|^???[^????????]|???[?????]????[?????]????", // ko-KR

      "address-level1":
        "(?<!(united|hist|history).?)state|county|region|province" +
        "|county|principality" + // en-UK
        "|????????????" + // ja-JP
        "|estado|provincia" + // pt-BR, pt-PT
        "|??????????????" + // ru
        "|???" + // zh-CN
        "|??????" + // zh-TW
        "|????????????????????????" + // ml
        "|??????????" + // fa
        "|???????????????" + // hi
        "|((\\b|_|\\*)(eyalet|[??s]ehir|[??ii??]l(imiz)?|kent)(\\b|_|\\*))" + // tr
        "|^???[?????]????", // ko-KR

      "postal-code":
        "zip|postal|post.*code|pcode" +
        "|pin.?code" + // en-IN
        "|postleitzahl" + // de-DE
        "|\\bcp\\b" + // es
        "|\\bcdp\\b" + // fr-FR
        "|\\bcap\\b" + // it-IT
        "|????????????" + // ja-JP
        "|codigo|codpos|\\bcep\\b" + // pt-BR, pt-PT
        "|????????????????.?????????????" + // ru
        "|?????????.??????????" + // hi
        "|???????????????????????????" + // ml
        "|????????????|??????" + // zh-CN
        "|????????????" + // zh-TW
        "|(\\b|_)posta kodu(\\b|_)" + // tr
        "|??????.???????", // ko-KR

      country:
        "country|countries" +
        "|pa??s|pais" + // es
        "|(\\b|_)land(\\b|_)(?!.*(mark.*))" + // de-DE landmark is a type in india.
        "|(?<!(???|???))???" + // ja-JP
        "|??????" + // zh-CN
        "|??????|??????" + // ko-KR
        "|(\\b|_)(??lke|ulce|ulke)(\\b|_)" + // tr
        "|????????", // fa

      // ==== Name Fields ====
      "cc-name":
        "card.?(?:holder|owner)|name.*(\\b)?on(\\b)?.*card" +
        "|(?:card|cc).?name|cc.?full.?name" +
        "|karteninhaber" + // de-DE
        "|nombre.*tarjeta" + // es
        "|nom.*carte" + // fr-FR
        "|nome.*cart" + // it-IT
        "|??????" + // ja-JP
        "|??????.*??????????" + // ru
        "|??????????????????|?????????|???????????????" + // zh-CN
        "|???????????????", // zh-TW

      name:
        "^name|full.?name|your.?name|customer.?name|bill.?name|ship.?name" +
        "|name.*first.*last|firstandlastname" +
        "|nombre.*y.*apellidos" + // es
        "|^nom(?!bre)" + // fr-FR
        "|?????????|??????" + // ja-JP
        "|^nome" + // pt-BR, pt-PT
        "|??????.*??????.*????????????????" + // fa
        "|??????" + // zh-CN
        "|(\\b|_|\\*)ad[??]? soyad[??]?(\\b|_|\\*)" + // tr
        "|??????", // ko-KR

      "given-name":
        "first.*name|initials|fname|first$|given.*name" +
        "|vorname" + // de-DE
        "|nombre" + // es
        "|forename|pr??nom|prenom" + // fr-FR
        "|???" + // ja-JP
        "|nome" + // pt-BR, pt-PT
        "|??????" + // ru
        "|??????" + // fa
        "|??????" + // ko-KR
        "|????????????" + // ml
        "|(\\b|_|\\*)(isim|ad|ad(i|??|iniz|??n??z)?)(\\b|_|\\*)" + // tr
        "|?????????", // hi

      "additional-name":
        "middle.*name|mname|middle$|middle.*initial|m\\.i\\.|mi$|\\bmi\\b",

      "family-name":
        "last.*name|lname|surname|last$|secondname|family.*name" +
        "|nachname" + // de-DE
        "|apellidos?" + // es
        "|famille|^nom(?!bre)" + // fr-FR
        "|cognome" + // it-IT
        "|???" + // ja-JP
        "|apelidos|surename|sobrenome" + // pt-BR, pt-PT
        "|??????????????" + // ru
        "|??????.*????????????????" + // fa
        "|???????????????" + // hi
        "|?????????????????????" + // ml
        "|(\\b|_|\\*)(soyisim|soyad(i|??|iniz|??n??z)?)(\\b|_|\\*)" + // tr
        "|\\b???(?:[^???]|\\b)", // ko-KR

      // ==== Credit Card Fields ====
      // Note: `cc-name` expression has been moved up, above `name`, in
      // order to handle specialization through ordering.
      "cc-number":
        "(add)?(?:card|cc|acct).?(?:number|#|no|num|field)" +
        "|(?<!telefon|haus|person|f??dsels)nummer" + // de-DE, sv-SE, no
        "|???????????????" + // ja-JP
        "|??????????.*??????????" + // ru
        "|????????????|???????????????" + // zh-CN
        "|???????????????" + // zh-TW
        "|??????" + // ko-KR
        // es/pt/fr
        "|(numero|n??mero|num??ro)(?!.*(document|fono|phone|r??servation))",

      "cc-exp-month":
        "expir|exp.*mo|exp.*date|ccmonth|cardmonth|addmonth" +
        "|gueltig|g??ltig|monat" + // de-DE
        "|fecha" + // es
        "|date.*exp" + // fr-FR
        "|scadenza" + // it-IT
        "|????????????" + // ja-JP
        "|validade" + // pt-BR, pt-PT
        "|???????? ???????????????? ??????????" + // ru
        "|???", // zh-CN

      "cc-exp-year":
        "exp|^/|(add)?year" +
        "|ablaufdatum|gueltig|g??ltig|jahr" + // de-DE
        "|fecha" + // es
        "|scadenza" + // it-IT
        "|????????????" + // ja-JP
        "|validade" + // pt-BR, pt-PT
        "|???????? ???????????????? ??????????" + // ru
        "|???|?????????", // zh-CN

      "cc-exp":
        "expir|exp.*date|^expfield$" +
        "|gueltig|g??ltig" + // de-DE
        "|fecha" + // es
        "|date.*exp" + // fr-FR
        "|scadenza" + // it-IT
        "|????????????" + // ja-JP
        "|validade" + // pt-BR, pt-PT
        "|???????? ???????????????? ??????????", // ru
    },
  ],

  _getRule(name) {
    let rules = [];
    this.RULE_SETS.forEach(set => {
      if (set[name]) {
        rules.push(`(${set[name]})`.normalize("NFKC"));
      }
    });

    const value = new RegExp(rules.join("|"), "iu");
    Object.defineProperty(this.RULES, name, { get: undefined });
    Object.defineProperty(this.RULES, name, { value });
    return value;
  },

  init() {
    Object.keys(this.RULES).forEach(field =>
      Object.defineProperty(this.RULES, field, {
        get() {
          return HeuristicsRegExp._getRule(field);
        },
      })
    );
  },
};

HeuristicsRegExp.init();
