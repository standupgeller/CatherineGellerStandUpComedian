declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
};

declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(
    handler: (req: Request) => Response | Promise<Response>,
    options?: unknown
  ): void;
}

declare function unescape(s: string): string;
