

export class TextRange {
  constructor(
    public start: number,
    public end: number,
    public value: string
  ) {
  }
}

export class ReplacementResult {
  constructor(
    public newText: string,
    public replaced: TextRange
  ) {
  }
}



export class WordPositionFinder {

  public findWord(text: string, position: number): TextRange {

    // Search for the word's beginning and end.
    let left = text.slice(0, position).search(/\S+$/);
    let right = text.slice(position).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      right = text.length;
    }else {
      right += position;
    }
    let word = text.substring(left, right);
    return new TextRange(left, right, word);
  }


  public replaceWord(text: string, position: number, replacement: string): ReplacementResult {

    let current = this.findWord(text, position);
    let beforePos = current.start;
    let before = text.substring(0, beforePos);
    let after = text.substring(current.end, text.length);

    let newText = before + replacement + after;

    return new ReplacementResult(
      newText,
      new TextRange(
        beforePos,
        beforePos + replacement.length, replacement
      )
    );
  }

}
