<template>
    <CardsDashCard data="" title="Website Analytics" class="flex-grow min-w-[300px] w-full lg:w-[calc(50%-10px)]"  BgColor="bg-purple-dark" />
    <div class="flex-grow md:min-w-[500px] w-full md:w-[calc(50%-10px)] flex flex-wrap gap-5">
        <CardsDashCard data="" title="Diagnistics" class="flex-grow min-w-[208px] w-full md:w-[calc(50%-10px)]" BgColor="bg-white" />
        <CardsDashCard data="" title="Revenue Generated" class="flex-grow min-w-[208px] w-full md:w-[calc(50%-10px)]" BgColor="bg-white" />
    </div>
    <div class="w-full flex flex-wrap gap-5">
        <CardsDashCard data="" title="My Auctions" :Size="2" class="flex-grow min-w-[300px] w-full md:w-[calc(50%-10px)]" BgColor="bg-white" />
        <CardsDashCard data="" title="Invoices" :Size="2" class="flex-grow min-w-[300px] w-full md:w-[calc(50%-10px)]" BgColor="bg-white" />
    </div>
</template>