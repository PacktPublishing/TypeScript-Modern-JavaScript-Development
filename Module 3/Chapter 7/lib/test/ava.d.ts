declare module "ava" {
	function test(name: string, run: (t: any) => void): void;
	namespace test {}
	export = test;
}
