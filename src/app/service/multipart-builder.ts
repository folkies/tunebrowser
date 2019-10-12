export interface MultiPartBody {
    type: string;
    body: string;
}

export class MultiPartBuilder {
    boundary: string;
    mimeType: string;
    parts: string[];
    body: string;

    constructor() {
        this.boundary = Math.random().toString(36).slice(2);
        this.mimeType = 'multipart/related; boundary="' + this.boundary + '"';
        this.parts = [];
    }

    append(mimeType: string, content: string): MultiPartBuilder {
        if (this.body !== undefined) {
            throw new Error("Builder has already been finalized.");
        }
        this.parts.push(
            "\r\n--", this.boundary, "\r\n",
            "Content-Type: ", mimeType, "\r\n\r\n",
            content);
        return this;
    }

    finish(): MultiPartBody {
        if (this.parts.length === 0) {
            throw new Error("No parts have been added.");
        }
        if (this.body === undefined) {
            this.parts.push("\r\n--", this.boundary, "--");
            this.body = this.parts.join('');
        }
        return {
            type: this.mimeType,
            body: this.body
        };
    }
}

